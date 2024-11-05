import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
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
} from '../redux/reducers/gameSelectors';
import {useIsFocused} from '@react-navigation/native';

const LudoboardScreen = () => {
  const player1 = useSelector(selectPlayer1);
  const player2 = useSelector(selectPlayer2);
  const player3 = useSelector(selectPlayer3);
  const player4 = useSelector(selectPlayer4);
  const isDiceTouch = useSelector(selectDiceTouch);
  const winner = useSelector(state => state.game.winner);

  const isFocused = useIsFocused();

  const [showStartImage, setShowStartImage] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const opacity = useRef(new Animated.Value(1)).current;

  // useEffect(() => {
  //   if (isFocused) {
  //     setShowStartImage(true);
  //     const blinkAnimation = Animated.loop(
  //       Animated.sequence([
  //         Animated.timing(opacity, {
  //           toValue: 0,
  //           duration: 500,
  //           useNativeDriver: true,
  //         }),
  //         Animated.timing(opacity, {
  //           toValue: 1,
  //           duration: 500,
  //           useNativeDriver: true,
  //         }),
  //       ]),
  //     );
  //     blinkAnimation.start();
  //     const timeout = setTimeout(() => {
  //       blinkAnimation.stop();
  //       setShowStartImage(false);
  //     }, 2500);
  //     return () => {
  //       blinkAnimation.stop();
  //       clearTimeout(timeout);
  //     };
  //   }
  // }, [isFocused]);

  return (
    <Wrapper>
      <TouchableOpacity style={styles.menuIconButton}>
        <Image source={MenuIcon} style={styles.menuIcon} />
      </TouchableOpacity>
      <View style={styles.container}>
        <View style={styles.flexRow}>
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
            <FourTraingles />
            <HorizontalPath color={'blue'} cells={plot3Data} />
          </View>
          <View style={styles.plotContainer}>
            <Pocket color={'red'} player={1} data={player1} />
            <VerticalPath color={'red'} cells={plot4Data} />
            <Pocket color={'blue'} player={4} data={player4} />
          </View>
        </View>
        <View style={styles.flexRow}>
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
});

export default LudoboardScreen;
