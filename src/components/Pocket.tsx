import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {fs} from '../utils/util.style';
import Plot from './Plot';

const Pocket = ({color, player}) => {
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
          <Plot pieceNo={0} player={player} color={color} />
          <Plot pieceNo={1} player={player} color={color} />
        </View>
        <View style={styles.flexRow}>
          <Plot pieceNo={2} player={player} color={color} />
          <Plot pieceNo={3} player={player} color={color} />
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
