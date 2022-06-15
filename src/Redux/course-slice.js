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

export const courseActions = courseSlice.actions;
export default courseSlice;
