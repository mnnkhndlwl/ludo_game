import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Clipboard,
} from 'react-native';
import {fs} from '../utils/util.style';
import {deviceHeight, deviceWidth} from '../constants/Scaling';
import {playSound} from '../utils/SoundUtils';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {resetGame} from '../redux/reducers/gameSlice';
import {
  createGameRoom,
  initWebSocket,
  isConnected,
} from '../utils/WebSocketUtil';

interface MultiplayerModalProps {
  visible: boolean;
  onPressHide: () => void;
}

const MultiplayerModal: React.FC<MultiplayerModalProps> = ({
  visible,
  onPressHide,
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [roomId, setRoomId] = useState<string>('');
  const [isCreatingRoom, setIsCreatingRoom] = useState<boolean>(false);
  const [isJoiningRoom, setIsJoiningRoom] = useState<boolean>(false);
  const [createdRoomId, setCreatedRoomId] = useState<string | null>(null);

  const handleCreateRoom = async () => {
    try {
      setIsCreatingRoom(true);
      playSound('ui');

      // Create a new game room
      const newRoomId = await createGameRoom();
      setCreatedRoomId(newRoomId);

      // Connect to the WebSocket with the new room ID
      await initWebSocket(newRoomId);

      setIsCreatingRoom(false);
    } catch (error) {
      console.error('Error creating room:', error);
      Alert.alert('Error', 'Failed to create game room. Please try again.');
      setIsCreatingRoom(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!roomId.trim()) {
      Alert.alert('Error', 'Please enter a room ID');
      return;
    }

    try {
      setIsJoiningRoom(true);
      playSound('ui');

      // Connect to the WebSocket with the provided room ID
      await initWebSocket(roomId.trim());

      setIsJoiningRoom(false);

      // Start the game
      dispatch(resetGame());
      navigation.navigate('LudoBoardScreen');
      playSound('game_start');

      // Close the modal
      onPressHide();
    } catch (error) {
      console.error('Error joining room:', error);
      Alert.alert(
        'Error',
        'Failed to join game room. Please check the room ID and try again.',
      );
      setIsJoiningRoom(false);
    }
  };

  const handleCopyRoomId = () => {
    if (createdRoomId) {
      Clipboard.setString(createdRoomId);
      Alert.alert('Success', 'Room ID copied to clipboard');
      playSound('ui');
    }
  };

  const handleStartGame = () => {
    if (isConnected()) {
      dispatch(resetGame());
      navigation.navigate('LudoBoardScreen');
      playSound('game_start');
      onPressHide();
    } else {
      Alert.alert('Error', 'Not connected to game room');
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onPressHide}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Multiplayer Game</Text>

          {/* Create Room Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Create a Game Room</Text>
            {createdRoomId ? (
              <View style={styles.roomInfoContainer}>
                <Text style={styles.roomIdText}>Room ID: {createdRoomId}</Text>
                <TouchableOpacity
                  style={styles.copyButton}
                  onPress={handleCopyRoomId}>
                  <Text style={styles.buttonText}>Copy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.startButton}
                  onPress={handleStartGame}>
                  <Text style={styles.buttonText}>Start Game</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.button}
                onPress={handleCreateRoom}
                disabled={isCreatingRoom}>
                {isCreatingRoom ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Create Room</Text>
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* Join Room Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Join a Game Room</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Room ID"
              placeholderTextColor="#999"
              value={roomId}
              onChangeText={setRoomId}
              editable={!isJoiningRoom}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleJoinRoom}
              disabled={isJoiningRoom}>
              {isJoiningRoom ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Join Room</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onPressHide}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: deviceWidth * 0.8,
    backgroundColor: '#1E5162',
    borderRadius: fs(20),
    padding: fs(20),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: fs(24),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: fs(20),
  },
  section: {
    width: '100%',
    marginBottom: fs(20),
  },
  sectionTitle: {
    fontSize: fs(18),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: fs(10),
  },
  input: {
    width: '100%',
    height: fs(50),
    backgroundColor: '#fff',
    borderRadius: fs(10),
    paddingHorizontal: fs(15),
    marginBottom: fs(10),
    fontSize: fs(16),
    color: '#333',
  },
  button: {
    width: '100%',
    height: fs(50),
    backgroundColor: '#4CAF50',
    borderRadius: fs(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: fs(16),
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: fs(10),
    padding: fs(10),
  },
  closeButtonText: {
    color: '#fff',
    fontSize: fs(16),
  },
  roomInfoContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: fs(10),
    padding: fs(15),
    marginBottom: fs(10),
  },
  roomIdText: {
    color: '#fff',
    fontSize: fs(16),
    marginBottom: fs(10),
  },
  copyButton: {
    backgroundColor: '#2196F3',
    padding: fs(10),
    borderRadius: fs(5),
    alignItems: 'center',
    marginBottom: fs(10),
  },
  startButton: {
    backgroundColor: '#FF9800',
    padding: fs(10),
    borderRadius: fs(5),
    alignItems: 'center',
  },
});

export default MultiplayerModal;
