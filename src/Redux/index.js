import { configureStore } from '@reduxjs/toolkit';
import poolsSlice from './pools-slice';

const redux = configureStore({
  reducer: { pools: poolsSlice.reducer },
});

export default redux;
