import {View, Text, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {fs} from '../utils/util.style';
import LottieView from 'lottie-react-native';
import Svg, {Polygon} from 'react-native-svg';

const FourTraingles = () => {
  const size = 300;
  const [blast, setBlast] = useState(false);

  return (
    <View style={styles.mainContainer}>
      {blast && (
        <LottieView
          source={require('../assets/animation/firework.json')}
          autoPlay
          loop
          hardwareAccelerationAndroid
          speed={1}
          style={styles.lottieView}
        />
      )}
      <Svg height={size} width={size - 5}>
        <Polygon
          points={`0,0 ${size / 2},${size / 2} ${size} ,0`}
          fill={'yellow'}
        />
        <Polygon
          points={`${size},0 ${size},${size} ${size / 2} ,${size / 2}`}
          fill={'blue'}
        />
        <Polygon
          points={`0,${size} ${size},${size} ${size / 2} ,${size / 2}`}
          fill={'red'}
        />
        <Polygon
          points={`0,0 ${size / 2},${size / 2} 0 ,${size}`}
          fill={'green'}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: fs(0.8),
    width: '20%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: 'white',
    borderColor: 'black',
  },
  lottieView: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    zIndex: 1,
  },
});

export default FourTraingles;
