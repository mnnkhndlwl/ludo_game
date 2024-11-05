import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {fs} from '../utils/util.style';
import Plot from './Plot';
import {useDispatch} from 'react-redux';
import {
  unfreezeDice,
  updatePlayerPieceValue,
} from '../redux/reducers/gameSlice';
import {startingPoints} from '../helpers/PlotData';

const Pocket = ({color, player, data}) => {
  const dispatch = useDispatch();
  const handlePress = async value => {
    let playerNo = value?.id[0];
    switch (playerNo) {
      case 'A':
        playerNo = 'player1';
        break;
      case 'B':
        playerNo = 'player2';
        break;
      case 'C':
        playerNo = 'player3';
        break;
      case 'D':
        playerNo = 'player4';
        break;
    }
    dispatch(
      updatePlayerPieceValue({
        playerNo: playerNo,
        pieceId: value?.id,
        pos: startingPoints[parseInt(playerNo.match(/\d+/)[0], 10) - 1],
        travelCount: 1,
      }),
    );
    dispatch(unfreezeDice());
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: color,
        },
      ]}>
      <View style={styles.childFrame}>
        <View style={styles.flexRow}>
          <Plot
            pieceNo={0}
            data={data}
            onPress={handlePress}
            player={player}
            color={color}
          />
          <Plot
            pieceNo={1}
            data={data}
            onPress={handlePress}
            player={player}
            color={color}
          />
        </View>
        <View style={styles.flexRow}>
          <Plot
            pieceNo={2}
            data={data}
            onPress={handlePress}
            player={player}
            color={color}
          />
          <Plot
            pieceNo={3}
            data={data}
            onPress={handlePress}
            player={player}
            color={color}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: fs(0.4),
    justifyContent: 'center',
    alignItems: 'center',
    width: '40%',
    height: '100%',
  },
  childFrame: {
    width: '70%',
    height: '70%',
    backgroundColor: 'white',
    justifyContent: 'space-between',
    padding: fs(15),
    borderRadius: fs(0.4),
  },
  flexRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '40%',
    flexDirection: 'row',
  },
});

export default React.memo(Pocket);
