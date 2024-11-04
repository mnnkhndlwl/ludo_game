import {createSlice} from '@reduxjs/toolkit';
import {initialState} from './initialState';

export const gameSlice = createSlice({
  name: 'game',
  initialState: initialState,
  reducers: {
    resetGame: () => initialState,
    updateDiceNo: (state, action) => {
      state.diceNo = action.payload?.diceNo;
      state.isDiceRolled = true;
    },
  },
});

export const {resetGame, updateDiceNo} = gameSlice.actions;

export default gameSlice.reducer;
