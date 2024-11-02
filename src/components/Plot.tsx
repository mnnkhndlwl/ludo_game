import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import Pile from './Pile';
import {fs} from '../utils/util.style';

const Plot = ({pieceNo, player, color}) => {
  return (
    <View style={[styles.plot, {backgroundColor: color}]}>
      <Pile color={color} player={player} />
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
