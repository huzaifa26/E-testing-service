import { configureStore } from '@reduxjs/toolkit';
import poolsSlice from './pools-slice';
import userSlice from './user-slice';
import { quizQuestions} from './quiz-slice';
import courseSlice, { courseContent, courseJoinSlice, courseStatus } from './course-slice';
import {courseId_Name,getCourseIdOnClick,courseCategories,courseClickUserId} from "./course-slice";

const redux = configureStore({
  //reducer name from which you exproted
  reducer: { pools: poolsSlice.reducer,user:userSlice.reducer, courses:courseSlice.reducer,courseId_Name:courseId_Name.reducer,getCourseIdOnClick:getCourseIdOnClick.reducer,courseCategories:courseCategories.reducer, courseJoin:courseJoinSlice.reducer,courseStatus:courseStatus.reducer,courseContent:courseContent.reducer,courseClickUserId:courseClickUserId.reducer,quizQuestions:quizQuestions.reducer}
});

export default redux;