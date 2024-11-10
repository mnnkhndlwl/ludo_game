import {View, Text, StyleSheet} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {announceWinner, resetGame} from '../redux/reducers/gameSlice';
import {playSound} from '../utils/SoundUtils';
import {resetAndNavigate} from '../utils/NavigationUtil';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import GradientButton from './GradientButton';
import {fs} from '../utils/util.style';
import HeartGirl from '../assets/animation/girl.json';
import Trophy from '../assets/animation/trophy.json';
import Firework from '../assets/animation/firework.json';
import Pile from './Pile';
import {colorPlayer} from '../helpers/PlotData';
import LottieView from 'lottie-react-native';

const WinModal = ({winner}) => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(!!winner);

  useEffect(() => {
    setVisible(!!winner);
  }, [winner]);

  const handleNewGame = useCallback(() => {
    dispatch(resetGame());
    dispatch(announceWinner(null));
    playSound('game_start');
  }, [dispatch]);

  const handleHome = useCallback(() => {
    dispatch(resetGame());
    dispatch(announceWinner(null));
    resetAndNavigate('HomeScreen');
  }, [dispatch]);

  return (
    <Modal
      style={styles.modal}
      isVisible={visible}
      backdropColor="black"
      backdropOpacity={0.8}
      onBackdropPress={() => {}}
      animationIn={'zoomIn'}
      animationOut={'zoomOut'}
      onBackButtonPress={() => {}}>
      <LinearGradient
        style={styles.gradientContainer}
        colors={['#0f0c29', '#303b63', '#24243e']}>
        <View style={styles.content}>
          <View style={styles.pileContainer}>
            <Pile player={1} color={colorPlayer[winner - 1]} />
          </View>
          <Text style={styles.congratsText}>
            Congratulations! pleyer {winner}{' '}
          </Text>
          <LottieView
            autoPlay
            hardwareAccelerationAndroid
            loop={false}
            source={Trophy}
            style={styles.trophyAnimation}
          />
          <LottieView
            autoPlay
            hardwareAccelerationAndroid
            loop={true}
            source={Firework}
            style={styles.fireworkAnimation}
          />
          <GradientButton title={'NEW GAME'} onPress={handleNewGame} />
          <GradientButton title={'HOME'} onPress={handleHome} />
        </View>
      </LinearGradient>
      <LottieView
        hardwareAccelerationAndroid
        autoPlay
        loop
        source={HeartGirl}
        style={styles.girlAnimation}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientContainer: {
    borderRadius: fs(20),
    padding: fs(20),
    width: '96%',
    borderWidth: fs(2),
    borderColor: 'gold',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  pileContainer: {
    width: fs(90),
    height: fs(40),
  },
  congratsText: {
    fontSize: fs(18),
    color: 'white',
    marginTop: fs(10),
  },
  trophyAnimation: {
    height: fs(200),
    width: fs(200),
    marginTop: fs(20),
  },
  fireworkAnimation: {
    height: fs(200),
    width: fs(500),
    position: 'absolute',
    zIndex: -1,
    marginTop: fs(20),
  },
  girlAnimation: {
    height: fs(500),
    width: fs(380),
    position: 'absolute',
    bottom: -200,
    zIndex: 99,
    right: -120,
  },
});

export default WinModal;
