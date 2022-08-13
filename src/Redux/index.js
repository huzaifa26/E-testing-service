import { configureStore } from '@reduxjs/toolkit';
import poolsSlice from './pools-slice';
import userSlice from './user-slice';
import courseSlice, { courseContent, courseJoinSlice, courseStatus } from './course-slice';
import {courseId_Name,getCourseIdOnClick,courseCategories,courseClickUserId} from "./course-slice";

const redux = configureStore({
  reducer: { pools: poolsSlice.reducer,user:userSlice.reducer, courses:courseSlice.reducer,courseId_Name:courseId_Name.reducer,getCourseIdOnClick:getCourseIdOnClick.reducer,courseCategories:courseCategories.reducer, courseJoin:courseJoinSlice.reducer,courseStatus:courseStatus.reducer,courseContent:courseContent.reducer,courseClickUserId:courseClickUserId.reducer}
});

export default redux;