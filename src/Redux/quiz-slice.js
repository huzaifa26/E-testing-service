import { createSlice } from '@reduxjs/toolkit';

export const quizQuestions = createSlice({
    name: 'quizQuestions',
    initialState: {
        quizQuestions:[{id:'hello'},{id:'hello2'}],
    },
    reducers: {
      quizQuestionsadd(state, action) {
        // state.quizQuestions = state.quizQuestions
        // state.quizQuestions = state.quizQuestions.push(action.payload);
        // state.quizQuestions= [...state.quizQuestions,action.payload];
      },
      quizQuestionsDelete(state,action)
      {
        //logic
      }
    },
  });


export const quizQuestionsActions = quizQuestions.actions;