import {View, Text, StyleSheet} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import {fs} from '../utils/util.style';
import Pile from './Pile';
import {ArrowSpots, SafeSpots, StarSpots} from '../helpers/PlotData';
import {ArrowRightIcon, StarIcon} from 'react-native-heroicons/outline';
import {useDispatch, useSelector} from 'react-redux';
import {selectCurrentPositions} from '../redux/reducers/gameSelectors';
import {handleForwardThunk} from '../redux/reducers/gameAction';

const Cell = ({cell, color, id}) => {
  const plottedPieces = useSelector(selectCurrentPositions);

  const isSafeSpot = useMemo(() => SafeSpots.includes(id), [id]);
  const isStarSpot = useMemo(() => StarSpots.includes(id), [id]);
  const isArrowSpot = useMemo(() => ArrowSpots.includes(id), [id]);

  const dispatch = useDispatch();

  const piecesAtPosition = useMemo(
    () => plottedPieces.filter(item => item?.pos === id),
    [plottedPieces, id],
  );

  const handlePress = useCallback(
    (playerNo, pieceId) => {
      dispatch(handleForwardThunk(playerNo, pieceId, id));
    },
    [dispatch, id],
  );

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
      {piecesAtPosition?.map((piece, index) => {
        const playerNo =
          piece?.id[0] === 'A'
            ? 1
            : piece?.id[0] === 'B'
            ? 2
            : piece?.id[0] === 'C'
            ? 3
            : 4;

        const pieceColor =
          piece?.id[0] === 'A'
            ? 'red'
            : piece?.id[0] === 'B'
            ? 'green'
            : piece?.id[0] !== 'C'
            ? 'blue'
            : 'yellow';

        return (
          <View
            key={piece?.id}
            style={[
              styles?.pieceContainer,
              {
                transform: [
                  {
                    scale: piecesAtPosition?.length === 1 ? 1 : 0.7,
                  },
                  {
                    translateX:
                      piecesAtPosition?.length === 1
                        ? 0
                        : index % 2 === 0
                        ? -6
                        : 6,
                  },
                  {
                    translateY:
                      piecesAtPosition?.length === 1 ? 0 : index < 2 ? -6 : 6,
                  },
                ],
              },
            ]}>
            <Pile
              cell={true}
              player={playerNo}
              pieceId={piece?.id}
              onPress={() => handlePress(playerNo, piece?.id)}
              color={pieceColor}
            />
          </View>
        );
      })}

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
