import {withDelay} from 'react-native-reanimated';
import {
  SafeSpots,
  StarSpots,
  startingPoints,
  turningPoints,
  victoryStart,
} from '../../helpers/PlotData';
import {selectCurrentPositions, selectDiceNo} from './gameSelectors';
import {
  announceWinner,
  disableTouch,
  unfreezeDice,
  updateFireworks,
  updatePlayerChance,
  updatePlayerPieceValue,
} from './gameSlice';
import {delay} from '../../utils/delay';
import {playSound} from '../../utils/SoundUtils';

export const handleForwardThunk =
  (playerNo, id, pos) => async (dispatch, getState) => {
    const state = getState();
    const plottedPieces = selectCurrentPositions(state);
    const diceNo = selectDiceNo(state);

    const alpha = getPlayerAlpha(playerNo);
    const piecesAtPosition = plottedPieces.filter(item => item.pos === pos);
    const piece = piecesAtPosition.find(item => item.id[0] === alpha);

    if (!piece) return;

    dispatch(disableTouch());

    let finalPath = piece.pos;
    const beforePlayerPiece = state.game[`player${playerNo}`].find(
      item => item.id === id,
    );

    let travelCount = beforePlayerPiece?.travelCount || 0;

    for (let i = 0; i < diceNo; i++) {
      const updatedPosition = getState();
      const playerPiece = updatedPosition.game[`player${playerNo}`].find(
        item => item.id === id,
      );

      let path = (playerPiece.pos + 1) % 52;

      if (
        turningPoints.includes(path) &&
        turningPoints[playerNo - 1] === path
      ) {
        path = victoryStart[playerNo - 1];
      }

      finalPath = path;
      travelCount += 1;

      dispatch(
        updatePlayerPieceValue({
          playerNo: `player${playerNo}`,
          pieceId: playerPiece.id,
          pos: path,
          travelCount: travelCount,
        }),
      );
      playSound('pile_move');
      await delay(200);
    }

    const updatedState = getState();
    const updatedPlottedPieces = selectCurrentPositions(updatedState);

    if (
      await handleCollisions(
        finalPath,
        updatedPlottedPieces,
        id,
        playerNo,
        dispatch,
      )
    ) {
      dispatch(unfreezeDice());
      return;
    }

    if (diceNo === 6 || travelCount === 57) {
      dispatch(updatePlayerChance({chancePlayer: playerNo}));

      if (
        travelCount === 57 &&
        checkWinningCriteria(getState().game[`player${playerNo}`])
      ) {
        playSound('home_win');
        dispatch(announceWinner(playerNo));
        playSound('cheer');
        dispatch(updateFireworks(true));
      }
      dispatch(unfreezeDice());
    } else {
      dispatch(updatePlayerChance({chancePlayer: getNextPlayer(playerNo)}));
    }
  };

// Helper Functions

function getPlayerAlpha(playerNo) {
  return playerNo === 1
    ? 'A'
    : playerNo === 2
    ? 'B'
    : playerNo === 3
    ? 'C'
    : 'D';
}

function getNextPlayer(playerNo) {
  return playerNo === 4 ? 1 : playerNo + 1;
}

async function handleCollisions(
  finalPath,
  updatedPlottedPieces,
  id,
  playerNo,
  dispatch,
) {
  const finalPlot = updatedPlottedPieces.filter(item => item.pos === finalPath);
  const ids = finalPlot.map(item => item.id[0]);
  const uniqueIds = new Set(ids);

  const areDifferentIds = uniqueIds.size > 1;

  if (SafeSpots.includes(finalPath) || StarSpots.includes(finalPath)) {
    playSound('safe_spot');
    return false;
  }

  if (areDifferentIds) {
    const enemyPiece = finalPlot.find(piece => piece.id[0] !== id[0]);

    if (enemyPiece) {
      await moveEnemyPieceToStart(enemyPiece, dispatch);
      playSound('collide');
    }
    return true;
  }
  return false;
}

async function moveEnemyPieceToStart(enemyPiece, dispatch) {
  const enemyId = enemyPiece.id[0];
  const no =
    enemyId === 'A' ? 1 : enemyId === 'B' ? 2 : enemyId === 'C' ? 3 : 4;
  let backwardPath = startingPoints[no - 1];

  for (let i = enemyPiece.pos; i !== backwardPath; i--) {
    if (i === 0) i = 52;

    dispatch(
      updatePlayerPieceValue({
        playerNo: `player${no}`,
        pieceId: enemyPiece.id,
        pos: i,
        travelCount: 0,
      }),
    );
    await delay(400);
  }

  dispatch(
    updatePlayerPieceValue({
      playerNo: `player${no}`,
      pieceId: enemyPiece.id,
      pos: 0,
      travelCount: 0,
    }),
  );
}

function checkWinningCriteria(pieces) {
  return pieces.every(piece => piece?.travelCount >= 57);
}
