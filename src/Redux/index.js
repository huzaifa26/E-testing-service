import { configureStore } from '@reduxjs/toolkit';
import poolsSlice from './pools-slice';
import userSlice from './user-slice';
import courseSlice from './course-slice';
import {courseId_Name} from "./course-slice";

const redux = configureStore({
  reducer: { pools: poolsSlice.reducer,user:userSlice.reducer, courses:courseSlice.reducer,courseId_Name:courseId_Name.reducer}
});

export default redux;