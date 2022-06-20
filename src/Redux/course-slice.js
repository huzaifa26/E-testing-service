import { createSlice } from '@reduxjs/toolkit';

const courseSlice = createSlice({
  name: 'course',
  initialState: {
      courses:[]
  },
  reducers: {
    courses(state, action) {
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

export const courseCategories=createSlice({
  name:"courseCategories",
  initialState: {
    courseCategories:[]
  },
  reducers:{
    courseCategories(state,actions){
      state.courseCategories=actions.payload
    }
  }
})


// Get Course id to show course Content, Pools, Course Sub Menu
export const getCourseIdOnClick=createSlice({
  name:"getCourseIdOnClick",
  initialState: {
    getCourseIdOnClick:[]
  },
  reducers:{
    getCourseIdOnClick(state,actions){
      state.getCourseIdOnClick=actions.payload
    }
  }
})

export const courseCategoriesActions = courseCategories.actions;
export const getCourseIdOnClickactions = getCourseIdOnClick.actions;
export const courseId_NameActions = courseId_Name.actions;
export const courseActions = courseSlice.actions;
export default courseSlice;
