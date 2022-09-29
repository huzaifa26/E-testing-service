import { configureStore } from '@reduxjs/toolkit';
import userSlice from './user-slice';
import {getCourseIdOnClick,courseClickUserId} from "./course-slice";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { combineReducers } from "redux";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  // if you do not want to persist this part of the state
  blacklist: ['omitedPart']
};

const reducer = combineReducers({
  user:userSlice.reducer, getCourseIdOnClick:getCourseIdOnClick.reducer,courseClickUserId:courseClickUserId.reducer
});

const persistedReducer = persistReducer(persistConfig, reducer);

const redux = configureStore({
  //reducer name from which you exproted
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
  getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export default redux;

