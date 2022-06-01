import { createSlice } from '@reduxjs/toolkit';

const poolsSlice = createSlice({
  name: 'pools',
  initialState: {
    allQuestions: [
      {
        "options": [
          "True",
          "False"
        ],
        "correctAnswer": "false",
        "questionType": "TRUE/FALSE",
        "courseId": "1",
        "question": "The earth is the fourth planet from the sun",
        "courseName": "Database"
      },
      {
        "options": [
          "+3q",
          "+2q",
          "-3q",
          "-4q"
        ],
        "correctAnswer": "+3q",
        "questionType": "MCQ",
        "courseId": "1",
        "question": "Three charges + 3q + q and Q are placed on a st. line with equal separation. In order to maket the net force on q to be zero, the value of Q will be :",
        "courseName": "Database"
      },
      {
        "options": [
          "Question/Answer",
          "Fill in the blanks"
        ],
        "questionType": "TEXT",
        "correctAnswer": "An economic and political system in which a country's trade and industry are controlled by private owners for profit, rather than by the state.",
        "courseId": "3",
        "question": "What is the capitalism ?",
        "courseName": "Assembly Language"
      },
      {
        "options": [
          "Question/Answer",
          "Fill in the blanks"
        ],
        "questionType": "TEXT",
        "correctAnswer": "Islamabad",
        "courseId": "1",
        "question": "________ is the capital of Pakistan ?",
        "courseName": "Database"
      }, 
    ],
  },
  reducers: {
    allQuestions(state, action) {
      state.allQuestions.push(action.payload);
      console.log(JSON.stringify(state, undefined, 2));
    },
  },
});

export const poolsActions = poolsSlice.actions;
export default poolsSlice;
