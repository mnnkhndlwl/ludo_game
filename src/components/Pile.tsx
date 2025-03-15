import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Easing,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {fs, height, width} from '../utils/util.style';
import {BackgroundImage} from '../helpers/GetIcons';
import {Svg, Circle} from 'react-native-svg';
import {useSelector} from 'react-redux';
import {
  selectCellSelection,
  selectDiceNo,
  selectPocketPileSelection,
} from '../redux/reducers/gameSelectors';

const Pile = ({color, cell, player, onPress, pieceId}) => {
  const pileImage = BackgroundImage.GetImage(color);
  const currentPlayerPileSelection = useSelector(selectPocketPileSelection);
  const currentPlayerCellSelection = useSelector(selectCellSelection);
  const diceNo = useSelector(selectDiceNo);
  const playerPieces = useSelector(state => state.game[`player${player}`]);
  const isPileEnabled = useMemo(
    () => player === currentPlayerPileSelection,
    [player, currentPlayerPileSelection],
  );
  const isCellEnabled = useMemo(
    () => player === currentPlayerCellSelection,
    [player, currentPlayerCellSelection],
  );

  const isForwadable = useCallback(() => {
    const piece = playerPieces?.find(item => item.id === pieceId);
    return piece && piece?.travelCount + diceNo <= 57;
  }, [playerPieces, pieceId, diceNo]);

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
    <TouchableOpacity
      style={styles.container}
      hitSlop={isCellEnabled ? {top: 10, bottom: 10, left: 10, right: 10} : {}}
      activeOpacity={0.5}
      disabled={!(cell ? isCellEnabled && isForwadable() : isPileEnabled)}
      onPress={onPress}>
      <View style={styles.hollowCircle}>
        {(cell ? isCellEnabled && isForwadable() : isPileEnabled) && (
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
        )}
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
