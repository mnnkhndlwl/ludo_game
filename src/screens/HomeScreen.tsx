import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  Pressable,
  Animated,
  Linking,
} from 'react-native';
import React, {useCallback, useEffect, useRef} from 'react';
import Wrapper from '../components/Wrapper';
import {deviceHeight, deviceWidth} from '../constants/Scaling';
import {fs} from '../utils/util.style';
import GradientButton from '../components/GradientButton';
import {useDispatch, useSelector} from 'react-redux';
import {selectCurrentPositions} from '../redux/reducers/gameSelectors';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {playSound} from '../utils/SoundUtils';
import SoundPlayer from 'react-native-sound-player';
import {resetGame} from '../redux/reducers/gameSlice';
import LottieView from 'lottie-react-native';

const HomeScreen = () => {
  const dispatch = useDispatch();

  const currentPostion = useSelector(selectCurrentPositions);

  const isFocused = useIsFocused();

  const navigation = useNavigation();

  const witchAnim = useRef(new Animated.Value(-deviceWidth)).current;
  const ScaleXAnim = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    if (isFocused) {
      playSound('home');
    }
  }, [isFocused]);

  const renderButton = useCallback(
    (title, onPress) => <GradientButton onPress={onPress} title={title} />,
    [],
  );

  const startGame = async (isNewGame = false) => {
    SoundPlayer.stop();
    if (isNewGame) {
      dispatch(resetGame());
    }
    navigation.navigate('LudoBoardScreen');
    playSound('game_start');
  };

  const handleNewGamePress = async () => {
    startGame(true);
  };

  const handleResumePress = async () => {
    startGame();
  };

  const loopAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(witchAnim, {
            toValue: deviceWidth * 0.02,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(ScaleXAnim, {
            toValue: -1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(3000),
        Animated.parallel([
          Animated.timing(witchAnim, {
            toValue: deviceWidth * 2,
            duration: 8000,
            useNativeDriver: true,
          }),
          Animated.timing(ScaleXAnim, {
            toValue: -1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(witchAnim, {
            toValue: -deviceWidth * 0.05,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(ScaleXAnim, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(3000),
        Animated.parallel([
          Animated.timing(witchAnim, {
            toValue: -deviceWidth * 2,
            duration: 8000,
            useNativeDriver: true,
          }),
          Animated.timing(ScaleXAnim, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();
  };

  useEffect(() => {
    const clenUpAnimation = () => {
      Animated.timing(witchAnim).stop();
      Animated.timing(ScaleXAnim).stop();
    };
    loopAnimation();
    return () => clenUpAnimation();
  }, [witchAnim, ScaleXAnim]);

  return (
    <Wrapper
      style={{
        justifyContent: 'flex-start',
      }}>
      <Animated.View style={styles.imgContainer}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.img}
        />
      </Animated.View>
      {currentPostion.length !== 0 && renderButton('RESUME', handleResumePress)}
      {renderButton('NEW GAME', handleNewGamePress)}
      {renderButton('VS CPU', () =>
        Alert.alert('Bhai ye feature abhi bana rha hu'),
      )}

      <Animated.View
        style={[
          styles.witchContainer,
          {
            transform: [
              {
                translateX: witchAnim,
              },
              {
                scaleX: ScaleXAnim,
              },
            ],
          },
        ]}>
        <Pressable
          onPress={() => {
            const random = Math.floor(Math.random() * 3) + 1;
            playSound(`girl${random}`);
          }}>
          <LottieView
            hardwareAccelerationAndroid
            source={require('../assets/animation/witch.json')}
            autoPlay
            loop
            speed={1}
            style={{
              height: fs(250),
              width: fs(250),
              transform: [
                {
                  rotate: '25deg',
                },
              ],
            }}
          />
        </Pressable>
      </Animated.View>

      <Pressable
        onPress={() => Linking.openURL('https://github.com/mnnkhndlwl')}>
        <Text style={StyleSheet.compose({bottom: fs(60)}, styles.madeBy)}>
          Made by Manan Khandelwal
        </Text>
      </Pressable>
      <Pressable
        onPress={() => Linking.openURL('https://github.com/mnnkhndlwl')}>
        <Text style={StyleSheet.compose({bottom: fs(40)}, styles.madeBy)}>
          www.github.com/mnnkhndlwl
        </Text>
      </Pressable>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  witchContainer: {
    top: '60%',
    left: '24%',
    position: 'absolute',
  },
  madeBy: {
    position: 'absolute',

    fontWeight: 800,
    fontStyle: 'italic',
    color: 'white',
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  imgContainer: {
    width: deviceWidth * 0.6,
    height: deviceHeight * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: fs(40),
  },
});

export default HomeScreen;
