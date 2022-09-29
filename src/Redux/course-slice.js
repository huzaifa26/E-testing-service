import { createSlice } from '@reduxjs/toolkit';

// Get Course id to show course Content, Pools, Course Sub Menu and status to show published or joined to change course main page view
export const getCourseIdOnClick=createSlice({
  name:"getCourseIdOnClick",
  initialState: {
    getCourseIdOnClick: JSON.parse(window.localStorage.getItem('getCourseIdOnClick')),
    
  },
  reducers:{
    getCourseIdOnClick(state,actions){
      state.getCourseIdOnClick=actions.payload
      console.log(JSON.stringify(state, undefined, 2))
    }
  }
})


export const courseClickUserId=createSlice({
  name:"courseClickUserId",
  initialState: {
    courseClickUserId:[],
  },
  reducers:{
    courseClickUserId(state,actions)
    {state.courseClickUserId = actions.payload
      // console.log(JSON.stringify(state, undefined, 2));
    }
  }
})

export const getCourseIdOnClickactions = getCourseIdOnClick.actions;
export const courseClickUserIdActions = courseClickUserId.actions;
