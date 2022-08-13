import { createSlice } from '@reduxjs/toolkit';

const courseSlice = createSlice({
  name: 'course',
  initialState: {
      courses:[],
  },
  reducers: {
    courses(state, action) {
      state.courses=action.payload;
    },
  },
});

export const courseJoinSlice = createSlice({
  name: 'courseJoin',
  initialState: {
      joinedCourses:[]
  },
  reducers: {
    joinedCourses(state, action) {
      state.joinedCourses=action.payload;
      console.log(JSON.stringify(state, undefined, 2));
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


// Get Course id to show course Content, Pools, Course Sub Menu and status to show published or joined to change course main page view
export const getCourseIdOnClick=createSlice({
  name:"getCourseIdOnClick",
  initialState: {
    getCourseIdOnClick:[],
  },
  reducers:{
    getCourseIdOnClick(state,actions){
      state.getCourseIdOnClick=actions.payload
    }
  }
})

export const courseStatus=createSlice({
  name:"courseStatus",
  initialState: {
    courseStatus:[],
  },
  reducers:{
    courseStatus(state,actions)
    {state.courseStatus = actions.payload}
  }
})

export const courseContent=createSlice({
  name:"courseContent",
  initialState: {
    courseContent:[],
  },
  reducers:{
    courseContent(state,actions)
    {state.courseContent = actions.payload
      console.log(JSON.stringify(state, undefined, 2));
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
      console.log(JSON.stringify(state, undefined, 2));
    }
  }
})

export const courseCategoriesActions = courseCategories.actions;
export const getCourseIdOnClickactions = getCourseIdOnClick.actions;
export const courseId_NameActions = courseId_Name.actions;
export const courseActions = courseSlice.actions;
export const courseJoinActions = courseJoinSlice.actions;
export const courseStatusActions = courseStatus.actions; 
export const courseContentActions = courseContent.actions;
export const courseClickUserIdActions = courseClickUserId.actions;
export default courseSlice;
