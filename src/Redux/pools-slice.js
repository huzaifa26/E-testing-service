import { createSlice } from '@reduxjs/toolkit';

const poolsSlice = createSlice({
  name: 'pools',
  initialState: {
    allQuestions: [],
  },
  reducers: {
    allQuestions(state, action) {
      state.allQuestions.push(action.payload);
      console.log(JSON.stringify(state, undefined, 2));
    },
  },
});

export const poolsActions = poolsSlice.actions;
export default poolsSlice;
