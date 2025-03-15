package main

import (
	"fmt"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

// Room represents a chat room with connected clients
type Room struct {
	clients    map[*Client]bool
	broadcast  chan Message
	register   chan *Client
	unregister chan *Client
}

// Client represents a connected WebSocket client
type Client struct {
	conn *websocket.Conn
	send chan Message
	room *Room
}

// Message represents a message sent in the room
type Message struct {
	RoomID  string `json:"room_id"`
	Content string `json:"content"`
	Event   string `json:"event"`
}

// Hub manages all rooms
type Hub struct {
	rooms map[string]*Room
	mutex sync.Mutex
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true }, // Allow all origins for simplicity
}

var hub = Hub{
	rooms: make(map[string]*Room),
}

// Creates a new room and adds it to the hub
func (h *Hub) createRoom(roomID string) *Room {
	h.mutex.Lock()
	defer h.mutex.Unlock()

	if _, exists := h.rooms[roomID]; !exists {
		room := &Room{
			clients:    make(map[*Client]bool),
			broadcast:  make(chan Message),
			register:   make(chan *Client),
			unregister: make(chan *Client),
		}
		h.rooms[roomID] = room
		go room.run() // Start the room's event loop
	}
	return h.rooms[roomID]
}

// Room event loop
func (r *Room) run() {
	for {
		select {
		case client := <-r.register:
			r.clients[client] = true
		case client := <-r.unregister:
			if _, ok := r.clients[client]; ok {
				close(client.send)
				delete(r.clients, client)
			}
		case message := <-r.broadcast:
			for client := range r.clients {
				select {
				case client.send <- message:
				default:
					close(client.send)
					delete(r.clients, client)
				}
			}
		}
	}
}

// Handle WebSocket connections
func wsHandler(w http.ResponseWriter, r *http.Request) {
	roomID := r.URL.Query().Get("room_id")
	if roomID == "" {
		http.Error(w, "Missing room_id", http.StatusBadRequest)
		return
	}

	// Upgrade HTTP connection to WebSocket
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Upgrade error:", err)
		return
	}

	// Get or create the room
	room := hub.createRoom(roomID)

	// Create a new client
	client := &Client{
		conn: conn,
		send: make(chan Message),
		room: room,
	}

	// Register the client in the room
	room.register <- client

	// Handle sending messages to the client
	go func() {
		defer func() {
			room.unregister <- client
			conn.Close()
		}()
		for message := range client.send {
			err := conn.WriteJSON(message)
			if err != nil {
				log.Println("Write error:", err)
				return
			}
		}
	}()

	// Handle receiving messages from the client
	go func() {
		defer func() {
			room.unregister <- client
			conn.Close()
		}()
		for {
			var msg Message
			err := conn.ReadJSON(&msg)
			if err != nil {
				log.Println("Read error:", err)
				return
			}
			msg.RoomID = roomID
			room.broadcast <- msg
		}
	}()
}

// HTTP endpoint to create a room
func createRoomHandler(w http.ResponseWriter, r *http.Request) {
	roomID := r.URL.Query().Get("room_id")
	if roomID == "" {
		http.Error(w, "Missing room_id", http.StatusBadRequest)
		return
	}

	hub.createRoom(roomID)
	fmt.Fprintf(w, "Room %s created or already exists", roomID)
}

func main() {
	http.HandleFunc("/ws", wsHandler)                  // WebSocket endpoint
	http.HandleFunc("/create-room", createRoomHandler) // Room creation endpoint

	log.Println("Server starting on :8080...")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
