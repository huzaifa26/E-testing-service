import React, { useEffect, useState } from 'react';
import styles from './EditQuiz.module.css'
import TextField from '@mui/material/TextField';
import { TabContext, TabPanel } from '@mui/lab';
import { Tabs, Tab, Box, Stack } from '@mui/material';
import CreateQuestion from './CreateQuestion';
import ImportPool from './ImportPool';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux';
import { MathComponent } from 'mathjax-react';
import moment from 'moment';

function EditQuiz() {


  const location = useLocation();
  const navigate = useNavigate();
  const courseClickUserId = useSelector(state => state.courseClickUserId.courseClickUserId)
  const user = useSelector(state => state.user);
  const courseIdredux = useSelector(state => state.getCourseIdOnClick.getCourseIdOnClick);
  const [cookie] = useCookies();
  const [quizQuestions, setQuizQuestions] = useState(location.state.previewDetails.questions);
  const [title, setTitle] = useState(location.state.previewDetails.quizTitle);
  const [time, setTime] = useState(30);
  const [questionShuffle, setQuestionShuffle] = useState(location.state.previewDetails.questionShuffle)
  const [answerShuffle, setAnswerShuffle] = useState(location.state.previewDetails.answerShuffle)
  const [seeAnswer, setSeeAnswer] = useState(location.state.previewDetails.seeAnswer)
  const [copyQuestion, setCopyQuestion] = useState(location.state.previewDetails.copyQuestion)
  const [detectMobile, setDetectMobile] = useState(location.state.previewDetails.detectMobile)
  const [startTime, setStartTime] = useState(location.state.previewDetails.startTime)
  const [endTime, setEndTime] = useState(location.state.previewDetails.endTime)
  const [totalPoints, setTotalPoints] = useState(location.state.previewDetails.totalPoints)
  const [value, setValue] = useState('1');
  const [add, setAdd] = useState(false);
  const [importPool, setImportPool] = useState(false)


  console.log(location.state.previewDetails.totalPoints);

  function handleChange(event, newValue) {
    setValue(newValue);
    setAdd(false)
  }

  function showMainQuiz() {
    console.log('hello')
    navigate("/courses/quiz");
  }

  const saveQuiz = () => {
    const checkEndTme = (endTime) => {
      let today = new Date().getTime();
      let assignmentEndTime = new Date(endTime).getTime();

      if (assignmentEndTime < today) {
        return true;
      } else {
        return false;
      }
    }

    if (quizQuestions.length == 0) {
      alert('you must add atleast one question')
      setValue('2')
      return
    }
    if (title === '') {
      setValue('1')
      alert('Please add title')
      return
    }
    if (startTime === '') {
      alert('Please assign Start time')
      setValue('1')
      return
    }
    if (endTime === '') {
      alert('Please assign End time')
      setValue('1')
      return
    }
    if (checkEndTme(startTime)) {
      alert('Start time can not be from past')
      return
    }

    if (checkEndTme(endTime)) {
      alert('End time can not be from past')
      return
    }


    let assignmentStartTime = new Date(startTime).getTime();

    let assignmentStartTime2 = new Date(endTime).getTime()
    console.log('newassignmentStartTime', assignmentStartTime);
    console.log('newassignmentStartTime2', assignmentStartTime2);
    if (assignmentStartTime > assignmentStartTime2) {
      alert('endTime is before startTime')
      return
    }

    let data = {
      id: location.state.previewDetails.id,
      title: title,
      questionShuffle: questionShuffle,
      answerShuffle: answerShuffle,
      seeAnswer: seeAnswer,
      copyQuestion: copyQuestion,
      detectMobile: detectMobile,
      startTime: startTime,
      endTime: endTime,
      userId: user.userInfo.user.id,
      courseId: courseIdredux,
      questions: quizQuestions,
      totalPoints: totalPoints
    }

    data.questions.forEach((item, index) => {

      let newArr = []
      if (item.questionType !== 'Subjective') {

        item.options.forEach((op) => {
          if (typeof (op) === "object")
            newArr.push(op.options)
        })
        if (newArr.length > 0)
          item.options = newArr
      }
    })

    let url = "http://localhost:5000/api/editQuiz/";
    axios.post(url, data, { withCredentials: true }, { headers: { Authorization: `Bearer ${cookie.token}` } }).then((res) => {
      console.log(res)
      if (res.status === 200) {
        toast.success('Updated', {
          position: toast.POSITION.TOP_CENTER,
        });
        navigate('/courses/quiz')
      }
    }).catch((err) => {
      console.log(err)
      toast.error('Failed', {
        position: toast.POSITION.TOP_CENTER,
      });
    })
  }

  const removeQuestion = (index, points) => {
    if (typeof (points) === 'string') {
      setTotalPoints((state) => state - parseInt(points))
    }
    else {
      setTotalPoints((state) => state - parseInt(points))
    }

    let data = [...quizQuestions];
    data.splice(index, 1);
    setQuizQuestions(data);

    toast.success('Deleted', {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  const getQuestion = (question) => {
    console.log(question)
    quizQuestions.push(question)
    console.log(quizQuestions)
    if (typeof (question.points) === 'string') {
      setTotalPoints((state) => state + parseInt(question.points))
    }
    else {
      setTotalPoints((state) => state + parseInt(question.points))
    }
  }

  const getQuestionFromPool = (question) => {
    console.log(question.length);
    var points = 0
    if (question.length === 1) {
      if (typeof (question[0].points) === 'string') {
        setTotalPoints((state) => state + parseInt(question[0].points))
      }
      else {
        setTotalPoints((state) => state + parseInt(question[0].points))
      }
    }
    else {
      question.forEach((val, index) => {
        if (typeof (val.points) === 'string') {
          setTotalPoints((state) => state + parseInt(val.points))
        }
        else {
          setTotalPoints((state) => state + parseInt(val.points))
        }

      })
    }
    // if (typeof (question.points) === 'string') {
    //   setTotalPoints((state) => state + parseInt(question.points))
    // }
    // else {
    //   setTotalPoints((state) => state + parseInt(question.points))
    // }
    setQuizQuestions([...quizQuestions, ...question]);
    console.log(quizQuestions)
  }

  const handleQuestionShuffle = (event) => {
    if (event.target.checked) {
      setQuestionShuffle(true)
    } else {
      setQuestionShuffle(false)
    }
  }

  const handleAnswerShuffle = (event) => {
    if (event.target.checked) {
      setAnswerShuffle(true)
    } else {
      setAnswerShuffle(false)
    }

  }
  const handleSeeAnswer = (event) => {
    if (event.target.checked) {
      setSeeAnswer(true)
    } else {
      setSeeAnswer(false)
    }
  }

  const handleCopyQuestion = (event) => {
    if (event.target.checked) {
      setCopyQuestion(true)
    } else {
      setCopyQuestion(false)
    }
  }

  const handleDetectMobile = (event) => {
    if (event.target.checked) {
      setDetectMobile(true)
    } else {
      setDetectMobile(false)
    }
  }



  return (
    <div className={styles.main}>

      <div>
        <Box sx={{ width: '100%' }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Detials" value="1" />
                <Tab label="Questions" value="2" />
              </Tabs>
            </Box>

            <TabPanel value="1" index={0}>
              <TextField id="outlined-basic" label="Quiz Title" variant="outlined" sx={{ marginLeft: '-22px', marginTop: '10px' }} size="small" value={title} onChange={(e) => setTitle(e.target.value)} required />
              <p className={styles.instructions}>
                <b>Quiz Instructions:</b>
              </p>
              <div className={styles.infolist}>
                <div className={styles.info}>
                  1. You will have only <em>{time} seconds&nbsp;</em> per each
                  question.
                </div>
                <div className={styles.info}>
                  2. Once you select your answer, it can't be undone.
                </div>
                <div className={styles.info}>
                  3. You can't select any option once time goes off.
                </div>
                <div className={styles.info}>
                  4. You can't exit from the Quiz
                </div>
                <div className={styles.info}>
                  5. A complete quiz log will be created of your activities
                </div>
              </div>

              <p className={styles.instructions}>
                <b>Options</b>
              </p>

              <Stack component="form" noValidate spacing={2}>
                <TextField id="datetime-local" label="Start Time" type="datetime-local" size='small' value={startTime} onChange={(e) => setStartTime(e.target.value)} sx={{ width: 250 }} InputLabelProps={{ shrink: true, }} />
                <TextField id="datetime-local" label="End Time" size='small' type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} sx={{ width: 250 }} InputLabelProps={{ shrink: true, }} />
              </Stack>

              <div className={styles.Options}>
                <input type="number" id="quantity" style={{ width: "70px", marginTop: "8px" }} className={styles.input} name="quantity" defaultValue={time} onChange={(e) => { setTime(e.target.value); }} min="1" max="100" ></input>
                <p>Time per question (Seconds)</p>
              </div>

              <div className={styles.Options1}>
                <input type="checkbox" name="checkbox-1" id="checkbox-1" onChange={handleCopyQuestion} />
                <label for="checkbox-1">
                  Do not allow Students to copy question text
                </label>
              </div>
            </TabPanel>

            <TabPanel value="2" index={1}>
              {(quizQuestions.length !== 0 && !add) && <p style={{ textAlign: 'end' }}>Total Points : {totalPoints}</p>}
              {(quizQuestions.length == 0 && !add) && <p className={styles.empty}>No questions yet</p>}

              {quizQuestions.map((item, index) => {
                return (
                  <div className={styles.questions}>
                    <div className={styles.head}>
                      <div>Points : {item.points}  </div>
                      <div>Sec : {item.time}</div>
                    </div>
                    <div className={styles.body}>
                      <div style={{ width: '90%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

                        {(item.questionImage !== null) &&
                          <div>
                            <img src={item.questionImage} style={{ maxWidth: '200px', height: '150px', marginBottom: '5px' }} alt="Question Image" />
                          </div>}

                        {item.questionType === 'Formula' ? <div style={{ display: "flex", justifyContent: 'flex-start' }}><MathComponent tex={item.question} /></div>
                          : <b>{item.question}</b>}
                      </div>

                      <div style={{ width: '10%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        {/* <i className="bi bi-pencil" style={{color:'blue',width:"8px",height:"8px",fontSize:'16px',verticalAlign:'.26em',marginRight:'8px'}}></i> */}
                        <svg onClick={() => removeQuestion(index, item.points)} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="red" className="bi bi-trash3" viewBox="0 0 16 16" > <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" /> </svg>
                      </div>
                    </div>
                  </div>
                )
              })}

              {add && <CreateQuestion close={setAdd} time={time} getQuestion={getQuestion} />}
              {importPool && <ImportPool close={setImportPool} getQuestion={getQuestionFromPool} />}

              <div className={styles.buttonContainer1}>
                <button className={styles.cancel} onClick={() => setAdd(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16" > <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" /> </svg>
                  New Question
                </button>
                <button className={styles.cancel} onClick={() => setImportPool(true)}>
                  <i className="bi bi-search"></i>Find Questions
                </button>
              </div>

            </TabPanel>
          </TabContext>
        </Box>

        <hr className={styles.hr}></hr>
        <div className={styles.buttonContainer}>
          <button onClick={showMainQuiz} className={styles.cancel}>
            Cancel
          </button>
          <button onClick={saveQuiz} className={styles.save}>
            Update
          </button>
        </div>
        <hr></hr>
      </div>

    </div>
  )
}

export default EditQuiz