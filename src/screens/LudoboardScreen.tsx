import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Alert,
} from 'react-native';
import Wrapper from '../components/Wrapper';
import MenuIcon from '../assets/images/menu.png';
import {fs} from '../utils/util.style';
import {deviceHeight, deviceWidth} from '../constants/Scaling';
import Dice from '../components/Dice';
import Pocket from '../components/Pocket';
import VerticalPath from '../components/VerticalPath';
import {plot1Data, plot2Data, plot3Data, plot4Data} from '../helpers/PlotData';
import HorizontalPath from '../components/HorizontalPath';
import FourTraingles from '../components/FourTraingles';
import {useSelector} from 'react-redux';
import {
  selectPlayer1,
  selectPlayer2,
  selectPlayer4,
  selectPlayer3,
  selectDiceTouch,
  selectCurrentPlayerChance,
} from '../redux/reducers/gameSelectors';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import MenuModal from '../components/MenuModal';
import {playSound} from '../utils/SoundUtils';
import WinModal from '../components/WinModal';
import {isConnected, getRoomId} from '../utils/WebSocketUtil';

const LudoboardScreen = () => {
  const player1 = useSelector(selectPlayer1);
  const player2 = useSelector(selectPlayer2);
  const player3 = useSelector(selectPlayer3);
  const player4 = useSelector(selectPlayer4);
  const isDiceTouch = useSelector(selectDiceTouch);
  const winner = useSelector(state => state.game.winner);
  const currentPlayerChance = useSelector(selectCurrentPlayerChance);

  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const [showStartImage, setShowStartImage] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [roomIdDisplay, setRoomIdDisplay] = useState('');

  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Check if we're in a multiplayer game
    if (isFocused) {
      const connected = isConnected();
      setIsMultiplayer(connected);

      if (connected) {
        const roomId = getRoomId();
        if (roomId) {
          setRoomIdDisplay(roomId);
        }
      }
    }
  }, [isFocused]);

  const handleMenuPress = useCallback(() => {
    playSound('ui');
    setMenuVisible(true);
  }, []);

  const handleCopyRoomId = useCallback(() => {
    if (roomIdDisplay) {
      // Copy room ID to clipboard
      Alert.alert(
        'Room ID',
        `Share this room ID with your friends: ${roomIdDisplay}`,
      );
    }
  }, [roomIdDisplay]);

  return (
    <Wrapper>
      <TouchableOpacity onPress={handleMenuPress} style={styles.menuIconButton}>
        <Image source={MenuIcon} style={styles.menuIcon} />
      </TouchableOpacity>

      {isMultiplayer && roomIdDisplay && (
        <TouchableOpacity
          onPress={handleCopyRoomId}
          style={styles.roomIdContainer}>
          <Text style={styles.roomIdText}>Room: {roomIdDisplay}</Text>
          <Text style={styles.roomIdSubtext}>Tap to share</Text>
        </TouchableOpacity>
      )}

      {isMultiplayer && (
        <View style={styles.playerTurnContainer}>
          <Text style={styles.playerTurnText}>
            {currentPlayerChance === 1
              ? 'Red'
              : currentPlayerChance === 2
              ? 'Green'
              : currentPlayerChance === 3
              ? 'Yellow'
              : 'Blue'}
            's Turn
          </Text>
        </View>
      )}

      <View style={styles.container}>
        <View
          style={styles.flexRow}
          pointerEvents={isDiceTouch ? 'none' : 'auto'}>
          <Dice color={'green'} player={2} data={player2} />
          <Dice color={'yellow'} rotate={true} data={player3} player={3} />
        </View>
        <View style={styles.ludoBoard}>
          <View style={styles.plotContainer}>
            <Pocket color={'green'} player={2} data={player2} />
            <VerticalPath color={'yellow'} cells={plot2Data} />
            <Pocket color={'yellow'} player={3} data={player3} />
          </View>
          <View style={styles.pathContainer}>
            <HorizontalPath color={'green'} cells={plot1Data} />
            <FourTraingles
              player1={player1}
              player2={player2}
              player3={player3}
              player4={player4}
            />
            <HorizontalPath color={'blue'} cells={plot3Data} />
          </View>
          <View style={styles.plotContainer}>
            <Pocket color={'red'} player={1} data={player1} />
            <VerticalPath color={'red'} cells={plot4Data} />
            <Pocket color={'blue'} player={4} data={player4} />
          </View>
        </View>
        <View
          style={styles.flexRow}
          pointerEvents={isDiceTouch ? 'none' : 'auto'}>
          <Dice color={'red'} player={1} data={player1} />
          <Dice color={'blue'} rotate={true} player={4} data={player4} />
        </View>
      </View>

      {showStartImage && (
        <Animated.Image
          source={require('../assets/images/start.png')}
          style={{
            height: deviceHeight * 0.2,
            width: deviceWidth * 0.5,
            position: 'absolute',
            opacity,
          }}
        />
      )}

      {menuVisible && (
        <MenuModal
          onPressHide={() => setMenuVisible(false)}
          visible={menuVisible}
        />
      )}
      {winner !== null && <WinModal winner={winner} />}
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  menuIcon: {
    width: fs(30),
    height: fs(30),
  },
  menuIconButton: {
    position: 'absolute',
    top: fs(60),
    left: fs(20),
  },
  container: {
    alignSelf: 'center',
    justifyContent: 'center',
    height: deviceHeight * 0.5,
    width: deviceWidth,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: fs(30),
    justifyContent: 'space-between',
  },
  ludoBoard: {
    height: '100%',
    width: '100%',
    alignSelf: 'center',
    padding: fs(10),
  },
  plotContainer: {
    width: '100%',
    height: '40%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: '#ccc',
  },
  pathContainer: {
    flexDirection: 'row',
    width: '100%',
    height: '20%',
    justifyContent: 'space-between',
    backgroundColor: '#1E5162',
  },
  roomIdContainer: {
    position: 'absolute',
    top: fs(60),
    right: fs(20),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: fs(10),
    borderRadius: fs(5),
    alignItems: 'center',
  },
  roomIdText: {
    color: '#fff',
    fontSize: fs(14),
    fontWeight: 'bold',
  },
  roomIdSubtext: {
    color: '#ddd',
    fontSize: fs(10),
  },
  playerTurnContainer: {
    position: 'absolute',
    top: fs(120),
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: fs(10),
    borderRadius: fs(5),
  },
  playerTurnText: {
    color: '#fff',
    fontSize: fs(16),
    fontWeight: 'bold',
  },
});

export default LudoboardScreen;
