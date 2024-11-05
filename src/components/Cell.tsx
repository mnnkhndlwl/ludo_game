import {View, Text, StyleSheet} from 'react-native';
import React, {useMemo} from 'react';
import {fs} from '../utils/util.style';
import Pile from './Pile';
import {ArrowSpots, SafeSpots, StarSpots} from '../helpers/PlotData';
import {ArrowRightIcon, StarIcon} from 'react-native-heroicons/outline';
import {useSelector} from 'react-redux';
import {selectCurrentPositions} from '../redux/reducers/gameSelectors';

const Cell = ({cell, color, id}) => {
  const plottedPieces = useSelector(selectCurrentPositions);

  const isSafeSpot = useMemo(() => SafeSpots.includes(id), [id]);
  const isStarSpot = useMemo(() => StarSpots.includes(id), [id]);
  const isArrowSpot = useMemo(() => ArrowSpots.includes(id), [id]);

  const piecesAtPosition = useMemo(() => {
    plottedPieces.filter;
  }, [plottedPieces, id]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isSafeSpot ? color : 'white',
        },
      ]}>
      {isStarSpot && <StarIcon size={fs(20)} color={'grey'} />}
      {isArrowSpot && (
        <ArrowRightIcon
          style={{
            transform: [
              {
                rotate:
                  id === 38
                    ? '180deg'
                    : id === 25
                    ? '90deg'
                    : id === 51
                    ? '-90deg'
                    : '0deg',
              },
            ],
          }}
          size={fs(12)}
          color={'black'}
        />
      )}
      {/* <Pile
        cell={true}
        player={2}
        pieceId={2}
        onPress={() => {}}
        color={color}
      /> */}
      {/* <Text>{id}</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: fs(0.4),
    borderColor: 'black',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieceContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    zIndex: 99,
  },
});

export default React.memo(Cell);
