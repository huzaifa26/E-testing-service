import DisplayQuiz from './DisplayQuiz';
import React, { useCallback, useEffect, useState } from 'react';
import Preview from './Preview';
import axios from 'axios';
import styles from './QuizTable.module.css'
import { Button, TableCell, TableRow } from '@mui/material';
import { toast } from 'react-toastify';
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";
import moment from 'moment';
import { useSelector } from 'react-redux';

function QuizTable(props) {


  const [cookie] = useCookies();
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [previewDetail, setPreviewDetail] = useState({})
  const [quizQuestionsModal, setQuizQuestionsModal] = useState(false)
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState([])

  const handlePreview = (item) => {
    navigate("/courses/preview", { state: { data: item, from: 'QuizTable' } })
  }

  const handleEdit = (item) => {
    navigate("/courses/editQuiz", { state: { previewDetails: item, from: 'QuizTable' } });
  }

  const handleResult = (item) => {
    navigate("/courses/quiz/result", { state: { previewDetails: item, from: 'QuizTable' } });
  }

  const handleDelete = (item) => {

    props.handleDelete(item)
  }

  const user = useSelector(state => state.user);

  const handleStartQuiz = (data) => {
    localStorage.setItem("quizQuestion", JSON.stringify(data))

    axios.get("http://localhost:5000/api/showQuizResult/" + user.userInfo.user.id + "/" + props.data.id, { withCredentials: true }).then((res) => {
      console.log(res.data)
      if (res.data.length > 0) {
        navigate("/courses/result", { state: { result: res.data, afterQuiz: true } })
      } else {
        navigate("/courses/displayQuiz", { state: { data: data, from: 'QuizTable' } });
        console.log(data);

      }
    }).catch((err) => {
      console.log(err);
    })
  }

  const [showQuiz, setShowQuiz] = useState(false)
  const [quizFinished, setQuizFinished] = useState(false)

  // CODE FOR CHECKING TIME.
  const [counter, setCounter] = useState(0)

  setTimeout(() => {
    setCounter(counter + 1)
  }, 10);

  useEffect(() => {
    let today = new Date();
    today = today.toLocaleString()

    let QuizStartTime = new Date(props.startTime).getTime()
    let QuizFinishTime = new Date(props.endTime).getTime();

    let currentTime = new Date().getTime()

    if (QuizStartTime < currentTime) {
      setShowQuiz(true)
    }
    if (QuizFinishTime <= currentTime) {
      setShowQuiz(false)
      setQuizFinished(true)
    }
  }, [counter])

  const checkEndTme = (endTime) => {
    const today = new Date().getTime(); // Get current time in milliseconds
    const assignmentStartTime = new Date(endTime).getTime(); // Convert endTime to time in milliseconds

    return assignmentStartTime < today;
  }


  {
    if (props.student === false)
      return (
        <TableRow key={props.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
          <TableCell className={styles.ind} align="left">{props.index + 1}</TableCell>
          <TableCell className={styles.ind} component="th" scope="row"><b>{props.quizTitle}</b></TableCell>
          <TableCell className={styles.ind} component="th">{props.startTime}</TableCell>
          <TableCell className={styles.ind} component="th">{props.endTime}</TableCell>
          <TableCell className={styles.ind} component="th" align='center'>
            {!checkEndTme(props.endTime) && <button className={styles.preview} onClick={() => handlePreview(props.data)}>Preview</button>}
            {checkEndTme(props.endTime) && <button className={styles.preview2} onClick={() => handleResult(props.data)}>Result</button>}
            <button className={styles.edit} onClick={() => handleEdit(props.data)}>Edit</button>
            <button className={styles.button0} onClick={() => handleDelete(props.data)}>Delete</button>
          </TableCell>
        </TableRow>
      )
  }

  {
    if (props.student === true)
      return (
        <>
          <TableRow key={props.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell className={styles.ind} align="left">{props.index + 1}</TableCell>
            <TableCell className={styles.ind} component="th" scope="row"><b>{props.quizTitle}</b></TableCell>
            <TableCell className={styles.ind} component="th">{props.startTime}</TableCell>
            <TableCell className={styles.ind} component="th">{props.endTime}</TableCell>
            <TableCell className={styles.ind} component="th" align='center'>
              {(showQuiz === false && quizFinished === false) && <Button variant="contained" disabled={true}>Upcomming</Button>}
              {showQuiz === true && <Button variant="contained" disabled={false} onClick={() => handleStartQuiz(props.data)}>Start</Button>}
              {quizFinished && <Button variant="contained" disabled={false} onClick={() => handleStartQuiz(props.data)}>Result</Button>}
            </TableCell>
          </TableRow>

          {quizQuestionsModal && <DisplayQuiz data={quizData} handleStartQuiz={setQuizQuestionsModal} />}
        </>
      )
  }

}

export default QuizTable