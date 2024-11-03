import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Easing,
} from 'react-native';
import React, {useEffect, useMemo, useRef} from 'react';
import {fs, height, width} from '../utils/util.style';
import {BackgroundImage} from '../helpers/GetIcons';
import {Svg, Circle} from 'react-native-svg';

const Pile = ({color, cell, player, onPress, pieceId}) => {
  const pileImage = BackgroundImage.GetImage(color);

  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const rotationAnimation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    rotationAnimation.start();
    return () => rotationAnimation.stop();
  }, [rotation]);

  const rotateInterpolate = useMemo(
    () =>
      rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
      }),
    [rotation],
  );

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.hollowCircle}>
        <View style={styles.dashedCircleContainer}>
          <Animated.View
            style={[
              styles.dashedCircle,
              {
                transform: [{rotate: rotateInterpolate}],
              },
            ]}>
            <Svg height={fs(18)} width={fs(18)}>
              <Circle
                cx="9"
                cy="9"
                r="8"
                stroke={'white'}
                strokeWidth="2"
                strokeDasharray="4 4"
                strokeDashoffset="0"
                fill="transparent"
              />
            </Svg>
          </Animated.View>
        </View>
      </View>

      <Image
        source={pileImage}
        style={{
          height: fs(32),
          width: fs(32),
          position: 'absolute',
          top: fs(-16),
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    alignSelf: 'center',
  },
  hollowCircle: {
    borderRadius: fs(25),
    width: fs(15),
    height: fs(15),
    position: 'absolute',
    borderWidth: fs(2),
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dashedCircleContainer: {},
  dashedCircle: {},
});

export default Pile;
