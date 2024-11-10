import {View, Text, StyleSheet} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {fs} from '../utils/util.style';
import {useDispatch, useSelector} from 'react-redux';
import {selectFireworks} from '../redux/reducers/gameSelectors';
import {updateFireworks} from '../redux/reducers/gameSlice';
import Svg, {Polygon} from 'react-native-svg';
import Pile from './Pile';
import {deviceHeight, deviceWidth} from '../constants/Scaling';

const FourTraingles = ({player1, player2, player3, player4}) => {
  const size = 300;
  const [blast, setBlast] = useState(false);

  const isFirework = useSelector(selectFireworks);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isFirework) {
      setBlast(true);
      const timer = setTimeout(() => {
        setBlast(false);
        dispatch(updateFireworks(false));
      }, 5000);
      return clearTimeout(timer);
    }
  }, [isFirework, dispatch]);

  const playerData = useMemo(
    () => [
      {
        player: player1,
        top: 55,
        left: 15,
        pieceColor: 'red',
        translate: 'translateX',
      },
      {
        player: player3,
        top: 52,
        left: 15,
        pieceColor: 'yellow',
        translate: 'translateX',
      },
      {
        player: player2,
        top: 20,
        left: -2,
        pieceColor: 'green',
        translate: 'translateY',
      },
      {
        player: player4,
        top: 20,
        right: -2,
        pieceColor: 'blue',
        translate: 'translateY',
      },
    ],
    [player1, player2, player3, player4],
  );

  const renderPlayerPieces = useCallback(
    (data, index) => (
      <PlayerPieces
        key={index}
        player={data?.player?.filter(item => item?.travelCount === 57)}
        style={{
          top: data?.top,
          left: data?.left,
          bottom: data?.bottom,
          right: data?.right,
        }}
        pieceColor={data?.pieceColor}
        translate={data?.translate}
      />
    ),
    [],
  );

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
      {playerData?.map(renderPlayerPieces)}
    </View>
  );
};

const PlayerPieces = ({player, style, pieceColor, translate}) => {
  return (
    <View style={[styles.container, style]}>
      {player.map((piece, pieceIndex) => (
        <View
          key={piece.id}
          pointerEvents="none"
          style={{
            top: 0,
            zIndex: 99,
            position: 'absolute',
            bottom: 0,
            transform: [
              {
                scale: 0.5,
              },
              {
                [translate]: 14 * pieceIndex,
              },
            ],
          }}>
          <Pile
            cell={true}
            player={player}
            pieceId={piece?.id}
            onPress={() => {}}
            color={pieceColor}
          />
        </View>
      ))}
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
  container: {
    width: deviceWidth * 0.063,
    height: deviceHeight * 0.032,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
});

export default FourTraingles;
