import { createSlice } from '@reduxjs/toolkit';

// Get Course id to show course Content, Pools, Course Sub Menu and status to show published or joined to change course main page view
export const getCourseIdOnClick = createSlice({
  name: "getCourseIdOnClick",
  initialState: {
    getCourseIdOnClick: [],

  },
  reducers: {
    getCourseIdOnClick(state, actions) {
      state.getCourseIdOnClick = actions.payload
    }
  }
})


export const courseClickUserId = createSlice({
  name: "courseClickUserId",
  initialState: {
    courseClickUserId: [],
  },
  reducers: {
    courseClickUserId(state, actions) {
      state.courseClickUserId = actions.payload
    }
  }
})

export const getCourseIdOnClickactions = getCourseIdOnClick.actions;
export const courseClickUserIdActions = courseClickUserId.actions;
