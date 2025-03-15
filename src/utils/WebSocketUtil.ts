import { store } from '../redux/store';
import {
  updateDiceNo,
  updatePlayerChance,
  updatePlayerPieceValue,
  announceWinner,
  updateFireworks,
} from '../redux/reducers/gameSlice';

// WebSocket connection instance
let ws: WebSocket | null = null;
let roomId: string | null = null;

// Event listeners
const listeners: { [key: string]: ((data: any) => void)[] } = {};

/**
 * Initialize WebSocket connection
 * @param room - Room ID to join
 * @returns Promise that resolves when connection is established
 */
export const initWebSocket = (room: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      roomId = room;
      resolve();
      return;
    }

    roomId = room;
    const wsUrl = `ws://192.168.1.4:8080/ws?room_id=${room}`;
    
    try {
      ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        resolve();
      };
      
      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          handleWebSocketMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(error);
      };
      
      ws.onclose = () => {
        console.log('WebSocket disconnected');
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      reject(error);
    }
  });
};

/**
 * Close WebSocket connection
 */
export const closeWebSocket = (): void => {
  if (ws) {
    ws.close();
    ws = null;
    roomId = null;
  }
};

/**
 * Send a message through WebSocket
 * @param event - Event type
 * @param content - Message content
 */
export const sendMessage = (event: string, content: any): void => {
  if (ws && ws.readyState === WebSocket.OPEN && roomId) {
    const message = {
      room_id: roomId,
      event,
      content: JSON.stringify(content),
    };
    ws.send(JSON.stringify(message));
  } else {
    console.error('WebSocket not connected');
  }
};

/**
 * Handle incoming WebSocket messages
 * @param message - Received message
 */
const handleWebSocketMessage = (message: any): void => {
  const { event, content } = message;
  
  if (!event) return;
  
  try {
    const parsedContent = JSON.parse(content);
    
    // Dispatch Redux actions based on event type
    switch (event) {
      case 'dice_roll':
        store.dispatch(updateDiceNo({ diceNo: parsedContent.diceNo }));
        break;
      
      case 'player_chance':
        store.dispatch(updatePlayerChance({ chancePlayer: parsedContent.chancePlayer }));
        break;
      
      case 'piece_move':
        store.dispatch(
          updatePlayerPieceValue({
            playerNo: parsedContent.playerNo,
            pieceId: parsedContent.pieceId,
            pos: parsedContent.pos,
            travelCount: parsedContent.travelCount,
          })
        );
        break;
      
      case 'winner':
        store.dispatch(announceWinner(parsedContent.winner));
        store.dispatch(updateFireworks(true));
        break;
      
      default:
        // Trigger any registered event listeners
        if (listeners[event]) {
          listeners[event].forEach(callback => callback(parsedContent));
        }
    }
  } catch (error) {
    console.error('Error handling WebSocket message:', error);
  }
};

/**
 * Register an event listener
 * @param event - Event to listen for
 * @param callback - Callback function
 */
export const addEventListener = (event: string, callback: (data: any) => void): void => {
  if (!listeners[event]) {
    listeners[event] = [];
  }
  listeners[event].push(callback);
};

/**
 * Remove an event listener
 * @param event - Event to stop listening for
 * @param callback - Callback function to remove
 */
export const removeEventListener = (event: string, callback: (data: any) => void): void => {
  if (listeners[event]) {
    listeners[event] = listeners[event].filter(cb => cb !== callback);
  }
};

/**
 * Create a new game room
 * @returns Promise that resolves with the room ID
 */
export const createGameRoom = async (): Promise<string> => {
  try {
    const roomId = Math.random().toString(36).substring(2, 10);
    const response = await fetch(`http://192.168.1.4:8080/create-room?room_id=${roomId}`);
    
    if (!response.ok) {
      throw new Error('Failed to create room');
    }
    
    return roomId;
  } catch (error) {
    console.error('Error creating game room:', error);
    throw error;
  }
};

/**
 * Check if WebSocket is connected
 * @returns True if connected, false otherwise
 */
export const isConnected = (): boolean => {
  return ws !== null && ws.readyState === WebSocket.OPEN;
};

/**
 * Get current room ID
 * @returns Current room ID or null if not in a room
 */
export const getRoomId = (): string | null => {
  return roomId;
}; 