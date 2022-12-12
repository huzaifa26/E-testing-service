import { createSlice } from '@reduxjs/toolkit';

const socketSlice = createSlice({
    name: 'socket',
    initialState: {
        socket: [],
    },
    reducers: {
        socket(state, action) {
            state.socket = action.payload;
        },
    },
});

export const socketActions = socketSlice.actions;
export default socketSlice;