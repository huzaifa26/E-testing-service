import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
<<<<<<< HEAD
    userInfo: [],
  },
  reducers: {
    userInfo(state, action) {
      state.userInfo.push(action.payload);
      console.log(JSON.stringify(state, undefined, 2));
=======
    userInfo: {},
  },
  reducers: {
    userInfo(state, action) {
      state.userInfo=action.payload;
      // console.log(JSON.stringify(state, undefined, 2));
>>>>>>> master
    },
  },
});

export const userActions = userSlice.actions;
<<<<<<< HEAD
export default userSlice;
=======
export default userSlice;
>>>>>>> master
