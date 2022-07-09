import { createSlice } from '@reduxjs/toolkit';

const poolsSlice = createSlice({
  name: 'pools',
  initialState: {
    allQuestions: [],
    change:false,
  },
  reducers: {
    allQuestions(state, action) {
      state.allQuestions.push(action.payload);
      console.log(JSON.stringify(state, undefined, 2));
    },
    change(state, action) {
      state.change = action.payload
      console.log(JSON.stringify(state.change, undefined, 2));
    },
  },
});

export const poolsActions = poolsSlice.actions;
export default poolsSlice;
