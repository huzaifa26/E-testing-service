import { createSlice } from '@reduxjs/toolkit';

const courseSlice = createSlice({
  name: 'course',
  initialState: {
      courses:[]
  },
  reducers: {
    courses(state, action) {
      console.log(action.payload);
      state.courses=action.payload;
    },
  },
});

export const courseId_Name=createSlice({
  name:"courseIdName",
  initialState: {
    courseIdName:[]
  },
  reducers:{
    courseIdName(state,actions){
      state.courseIdName=actions.payload
    }
  }
})

export const courseId_NameActions = courseId_Name.actions;
export const courseActions = courseSlice.actions;
export default courseSlice;
