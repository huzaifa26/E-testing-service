import styles from './Quiz.module.css';
import React, { useCallback, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { TabContext, TabPanel } from '@mui/lab';
import { Tabs, Tab, Box, Stack, Paper, TablePagination, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import TableContainer from '@mui/material/TableContainer'
import CreateQuestion from './CreateQuestion';
import { useSelector } from 'react-redux';
import ImportPool from './ImportPool';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useCookies } from 'react-cookie';
import { styled } from '@mui/material/styles';
import DisplayQuiz from './DisplayQuiz';
import Preview from './Preview';
import { useNavigate } from "react-router-dom";
import { MathComponent } from 'mathjax-react';
import QuizTable from './QuizTable';
import moment from 'moment';
import BuildQuestion from './BuildQuestion';


function Quiz(props) {

  const [cookie] = useCookies();
  const courseIdredux = useSelector(state => state.getCourseIdOnClick.getCourseIdOnClick);
  const courseClickUserId = useSelector(state => state.courseClickUserId.courseClickUserId)
  const user = useSelector(state => state.user);
  //value is for tabs
  const [value, setValue] = useState('1');
  const [createQuiz, setCreateQuiz] = useState(false);
  const [add, setAdd] = useState(false);
  const [importPool, setImportPool] = useState(false)
  const [build, setBuild] = useState(false)
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState(30);
  const [questionShuffle, setQuestionShuffle] = useState(false)
  const [answerShuffle, setAnswerShuffle] = useState(false)
  const [seeAnswer, setSeeAnswer] = useState(false)
  const [copyQuestion, setCopyQuestion] = useState(false)
  const [detectMobile, setDetectMobile] = useState(false)
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [totalQuizzes, setTotalQuizzes] = useState([])
  const [totalPoints, setTotalPoints] = useState(0)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  function handleChange(event, newValue) {
    setValue(newValue);
    setAdd(false)
  }

  function showAddQuiz() {

    setCreateQuiz(true);
  }

  function showMainQuiz() {
    console.log(time)
    setCreateQuiz(false);
    setQuizQuestions([])
    setTitle('')
    setStartTime('')
    setEndTime('')
    setTime(30)
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

    if (assignmentStartTime > assignmentStartTime2) {
      alert('endTime is before startTime')
      return
    }

    // let endTime = endTime
    // let today = new Date();
    // today = today.toLocaleString()

    // let QuizFinishTime = new Date(endTime)
    // QuizFinishTime = QuizFinishTime.toLocaleString()

    // let newQuizFinishTime = moment(QuizFinishTime)

    // if (newQuizFinishTime.isBefore(today) === true) {
    //   alert("You can't assign End time before today")
    // }

    // let startTime = startTime
    // let today2 = new Date();
    // today2 = today2.toLocaleString()

    // let QuizFinishTime2 = new Date(startTime)
    // QuizFinishTime2 = QuizFinishTime2.toLocaleString()

    // let newQuizFinishTime2 = moment(QuizFinishTime2)

    // if (newQuizFinishTime2.isBefore(today) === true) {
    //   alert("You can't assign Start time before today")
    // }

    let data = {
      title: title,
      questionShuffle: questionShuffle,
      answerShuffle: answerShuffle,
      seeAnswer: seeAnswer,
      copyQuestion: copyQuestion,
      detectMobile: detectMobile,
      startTime: startTime,
      endTime: endTime,
      questions: quizQuestions,
      userId: user.userInfo.user.id,
      courseId: courseIdredux,
      totalPoints: totalPoints
    }

    data.questions.forEach((item, index) => {

      // console.log(item)
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
    console.log(data.questions)

    let url = "http://localhost:5000/api/quiz/";
    axios.post(url, data, { withCredentials: true }, { headers: { Authorization: `Bearer ${cookie.token}` } }).then((res) => {
      console.log(res)
      setCreateQuiz(false);
      setTime(30)
      setTitle('')
      setCopyQuestion(false)
      setSeeAnswer(false)
      setQuestionShuffle(false)
      setQuizQuestions([])
      setDetectMobile(false)
      setStartTime('')
      setEndTime('')
      fetchQuiz()
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
    quizQuestions.push(question)
    if (typeof (question.points) === 'string') {
      setTotalPoints((state) => state + parseInt(question.points))
    }
    else {
      setTotalPoints((state) => state + parseInt(question.points))
    }
  }

  const getQuestionFromPool = (question) => {

    question.forEach(element => {
      if (typeof (element.points) === 'string') {
        setTotalPoints((state) => state + parseInt(element.points))
      }
      else {
        setTotalPoints((state) => state + parseInt(element.points))
      }
    });

    setQuizQuestions([...quizQuestions, ...question]);
  }

  const getQuestionFromBuild = (question) => {

    question.forEach(element => {
      if (typeof (element.points) === 'string') {
        setTotalPoints((state) => state + parseInt(element.points))
      }
      else {
        setTotalPoints((state) => state + parseInt(element.points))
      }
    });

    setQuizQuestions([...quizQuestions, ...question]);

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


  const [quizData, setQuizData] = useState([])
  const [quizQuestionsModal, setQuizQuestionsModal] = useState(false)



  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const fetchQuiz = () => {
    axios.get("http://localhost:5000/api/getAllQuizzes/" + courseIdredux, { withCredentials: true }, { headers: { Authorization: `Bearer ${cookie.token}` } }
    ).then((res) => {
      setTotalQuizzes(res.data.data)
    }).catch((err) => {
      console.log(err);
    })
  }


  const handleEdit = (item) => {
    console.log('edited')
  }

  const handleDelete = (item) => {
    let data = { id: item.id }
    let url = "http://localhost:5000/api/quizDelete/";
    axios.post(url, data, { withCredentials: true }, { headers: { Authorization: `Bearer ${cookie.token}` } }).then((res) => {
      if (res.status === 200) {
        toast.success('Deleted', { position: toast.POSITION.TOP_RIGHT, });
      }
      fetchQuiz()
    }).catch((err) => {
      console.log(err);
    })
  }

  useEffect(() => {
    fetchQuiz()
  }, []);

  return (
    <div className={createQuiz ? styles.main : styles.main2} >
      {(!createQuiz && user.userInfo.user.id == courseClickUserId) && (
        <>
          <div className={styles.heads}>

            <h1>Quiz</h1>
            <div className={styles.container}>
              <button className={styles.button1} onClick={showAddQuiz}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" /> </svg>{' '}
                Quiz
              </button>
            </div>
          </div>

          <div className={styles.okok}>
            <div className={styles.headss}><p>Teacher</p></div>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table" color="#F7F6F2">
                <TableHead sx={{ color: 'white' }}>
                  <TableRow >
                    <TableCell className={styles.headTitle} ></TableCell>
                    <TableCell className={styles.headTitle}  >Title</TableCell>
                    <TableCell className={styles.headTitle} >Start Time</TableCell>
                    <TableCell className={styles.headTitle} >End time</TableCell>
                    <TableCell className={styles.headTitle2} align='center' >Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody >
                  {totalQuizzes.length === 0 && <TableRow >
                    <TableCell colspan="7" style={{ "text-align": "center", }}>No Quiz Uploaded yet</TableCell>
                  </TableRow>}

                  {totalQuizzes?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                    <QuizTable handleEdit={handleEdit} handleDelete={handleDelete} index={index} data={item} id={item.id} quizTitle={item.quizTitle} startTime={item.startTime} endTime={item.endTime} student={false} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[7]}
              component="div"
              count={totalQuizzes.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
        </>
      )}

      {(!createQuiz && user.userInfo.user.id !== courseClickUserId) && (
        <>
          <div className={styles.heads}>

            <h1>Quiz</h1>
          </div>
          <div className={styles.okok}>
            <div className={styles.headss}><p>Student</p></div>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table" color="#F7F6F2">
                <TableHead sx={{ color: 'white' }}>
                  <TableRow >
                    <TableCell className={styles.headTitle} ></TableCell>
                    <TableCell className={styles.headTitle}  >Title</TableCell>
                    <TableCell className={styles.headTitle} >Start Time</TableCell>
                    <TableCell className={styles.headTitle} >End time</TableCell>
                    <TableCell className={styles.headTitle2} align='center' >Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody >
                  {totalQuizzes.length === 0 && <TableRow >
                    <TableCell colspan="7" style={{ "text-align": "center", }}>No Quiz Uploaded yet</TableCell>
                  </TableRow>}

                  {totalQuizzes?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) =>
                  (
                    <QuizTable index={index} data={item} id={item.id} quizTitle={item.quizTitle} startTime={item.startTime} endTime={item.endTime} student={true} />
                  ))}
                </TableBody>

              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[7]}
              component="div"
              count={totalQuizzes.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>

        </>
      )}

      {createQuiz && (
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

              <TabPanel sx={{ padding: '20px' }} className={styles.hello} value="1" index={0}>
                <TextField id="outlined-basic" label="Quiz Title" variant="outlined" sx={{ marginLeft: '-22px', marginTop: '10px' }} size="small" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <p style={{ marginBottom: '20px' }} className={styles.instructions}>
                  <b>Options</b>
                </p>

                <Stack component="form" noValidate spacing={2}>
                  <TextField id="datetime-local" label="Start Time" type="datetime-local" size='small' value={startTime} onChange={(e) => setStartTime(e.target.value)} sx={{ width: 250 }} InputLabelProps={{ shrink: true, }} />
                  <TextField id="datetime-local" label="End Time" size='small' type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} sx={{ width: 250 }} InputLabelProps={{ shrink: true, }} />
                </Stack>

                <div className={styles.Options3}>
                  <input style={{ width: "70px", marginTop: "8px" }} type="number" id="quantity" className={styles.input1} name="quantity" defaultValue={time} onChange={(e) => { setTime(e.target.value); }} min="1" max="100" ></input>
                  <p>Time per question (Seconds)</p>
                </div>

                <div className={styles.Options1}>
                  <input type="checkbox" name="checkbox-1" id="checkbox-1" onChange={handleCopyQuestion} />
                  <label for="checkbox-1">
                    Do not allow Students to copy question text
                  </label>
                </div>
              </TabPanel>

              <TabPanel sx={{ padding: '20px 10px' }} className={styles.hello} value="2" index={1}>
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
                              <img src={item.questionImage} style={{ height: '150px', marginBottom: '5px' }} alt="Question Image" />
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
                {build && <BuildQuestion close={setBuild} getQuestion={getQuestionFromBuild} />}

                <div className={styles.buttonContainer1}>
                  <button className={`flex justify-center items-center ${styles.cancel}`} onClick={() => setAdd(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16" > <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" /> </svg>
                    New Question
                  </button>
                  <button className={styles.cancel} onClick={() => setImportPool(true)}>
                    <i className="bi bi-search"></i>Find Questions
                  </button>
                  <button className={styles.cancel} onClick={() => setBuild(true)}>
                    <i className="bi bi-arrow-right-circle"></i>Build Questions
                  </button>
                </div>

              </TabPanel>
            </TabContext>
          </Box>

          <hr className={styles.hr}></hr>
          <div className={styles.buttonContainer}>
            <button style={{ background: "white", boxShadow: "0px 0px 0px #000000" }} onClick={showMainQuiz} className={"!bg-white button !border-[2px] !border-black !text-black "}>
              Cancel
            </button>
            <button onClick={saveQuiz} className={"button"}>
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Quiz;