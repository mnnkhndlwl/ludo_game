import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import Pile from './Pile';
import {fs} from '../utils/util.style';

const Plot = ({pieceNo, player, color, data, onPress}) => {
  return (
    <View style={[styles.plot, {backgroundColor: color}]}>
      {data && data[pieceNo]?.pos === 0 && (
        <Pile
          color={color}
          player={player}
          onPress={() => onPress(data[pieceNo])}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  plot: {
    backgroundColor: 'green',
    height: '80%',
    width: '36%',
    borderRadius: fs(120),
  },
});

export default Plot;
