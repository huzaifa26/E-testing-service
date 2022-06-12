import { configureStore } from '@reduxjs/toolkit';
import poolsSlice from './pools-slice';
import userSlice from './user-slice';

const redux = configureStore({
  reducer: { pools: poolsSlice.reducer, user: userSlice.reducer},
});

export default redux;