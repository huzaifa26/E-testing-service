import React, { useEffect, useState, useRef } from 'react'
import styles from './DisplayQuiz.module.css'
import { useSelector } from 'react-redux';
import { Offline, Online } from "react-detect-offline";
import axios from 'axios';
import { useCookies } from 'react-cookie';
import Result from './Result';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState } from 'draft-js';
import { useLocation, useNavigate } from 'react-router-dom';
import { MathComponent } from 'mathjax-react';
import { toast } from 'react-toastify';
import moment from "moment";



function DisplayQuiz() {
  const location = useLocation()

  if (location.state !== null) {
    // Do nothing
  } else if (location.state === null) {
    let quizQuestionLS = localStorage.getItem("quizQuestion");
    quizQuestionLS = JSON.parse(quizQuestionLS)
    let data = { data: quizQuestionLS,from:null }
    console.log(data)
    location.state = data
  }

  const [questions, setQuestions] = useState(location?.state?.data?.questions)
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [currentQuestion, setCurrentQuestion] = useState([])
  const [questionState, setQuestionsState] = useState([]);
  const [totalLength, setTotalLength] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(1)
  const [selected, setSelected] = useState('')
  const [time, setTime] = useState(30)
  const [showResult, setShowResult] = useState(false)
  const user = useSelector(state => state.user);
  const [cookie] = useCookies();
  var timer;
  const [tabHasFocus, setTabHasFocus] = useState(true);
  const [countLostFocus, setCountLostFocus] = useState(0)
  const [triggerGetTabFocus, setTriggerGetTabFocus] = useState(false)
  const navigate = useNavigate();
  const quizLengthRef = useRef()

  //FOR GETTING INITIAL ATTEMPTED QUESTIONS
  useEffect(() => {
    if (location.state.data.questionShuffle == 1) { setQuestions(location.state.data.questions.sort(() => Math.random() - 0.5)) }
    else { setQuestions(location.state.data.questions) }

    if (location.state.data.answerShuffle == 1) { }

    if (location.state.data.seeAnswer == 1) { }

    if (location.state.data.detectMobile == 1) { }

    endQuizAfterTimeFinished()

    axios.get("http://localhost:5000/api/getAtempttedQuizQuestions/" + user.userInfo.user.id + "/" + location.state.data.id, { withCredentials: true })
      .then((res) => {
        setCurrentIndex((state) => state + res?.data?.length)
        setTotalLength(questions.length)

        let attempted = questions.filter(ar => !res.data.find(rm => (rm.quizQuestionId === ar.id)))
        if (attempted?.length === 0) {
          navigate("/courses/result", { state: { userId: user.userInfo.user.id, quizId: location.state.data.id, afterQuiz: false } })
          return
        }

        let question = attempted.shift()
        setCurrentQuestion(question)
        setQuestions([...attempted])
        quizLengthRef.current = attempted.length;

        if(location.state.from === "QuizTable")
        {
          if(localStorage.getItem("counter") === undefined)
          {setTime(question?.time);
          console.log('time of question added undefined')}
          if(localStorage.getItem("counter") !== undefined)
          {
            let oldTime=localStorage.getItem("counter")
            oldTime = JSON.parse(oldTime)
            setTime(()=> +oldTime)
          }
        }
        else
        {
          let oldTime=localStorage.getItem("counter")
          oldTime = JSON.parse(oldTime)
          setTime(()=> +oldTime)
        }
        setQuestionsState([...attempted])
      }).catch((err) => {
        console.log(err);
      })
    // TO PREVENT GOING BACK FROM QUIZ
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener('popstate', function (event) {
      window.history.pushState(null, document.title, window.location.href);
    });
  }, [])

  
  //ONCLICK OF NEXT QUESTION
  const handleCurrentQuestion = () => {
    if (currentQuestion.questionType !== "Subjective") {
      let data = {
        userId: user.userInfo.user.id,
        quizId: location.state.data.id,
        quizQuestionId: currentQuestion.id,
        correctOption: currentQuestion.correctOption,
        selectedOption: selected
      }

      if (selected !== "") { data.selectedOption = selected; setSelected('') }
      else { data.selectedOption = null; setSelected('') }

      if (currentQuestion.correctOption === selected) { data.obtainedMarks = currentQuestion.points }
      else { data.obtainedMarks = 0 }

      let url = "http://localhost:5000/api/atempttedQuizQuestions/";
      axios.post(url, data, { withCredentials: true }, { headers: { Authorization: `Bearer ${cookie.token}` } }).then((res) => {
        console.log(res)
      }).catch((err) => {
        console.log(err)
      })

      if (quizLengthRef.current === 0) {
        console.log('i ran')
        axios.post('http://localhost:5000/api/addQuizResult', { userId: data.userId, quizId: data.quizId }, { withCredentials: true }, { headers: { Authorization: `Bearer ${cookie.token}` } }).then((res) => {
        // localStorage.removeItem('counter');
          axios.get("http://localhost:5000/api/showQuizResult/" + data.userId + "/" + data.quizId, { withCredentials: true }).then((res) => {
            navigate("/courses/result", { state: { result: res.data, afterQuiz: true } })
          }).catch((err) => {
            console.log(err);
          })
        }).catch((err) => {
          console.log(err)
        })
        }
      }
      else {
      let data = {
        userId: user.userInfo.user.id,
        quizId: location.state.data.id,
        quizQuestionId: currentQuestion.id,
        correctOption: currentQuestion.correctOption,
        selectedOption: editorState.getCurrentContent().getPlainText(),
        obtainedMarks: 0
      }

      if (quizLengthRef.current === 0) {
        console.log('i ran 2')
        axios.post('http://localhost:5000/api/addQuizResult', { userId: data.userId, quizId: data.quizId }, { withCredentials: true }, { headers: { Authorization: `Bearer ${cookie.token}` } }).then((res) => {
        localStorage.removeItem('counter');
          axios.get("http://localhost:5000/api/showQuizResult/" + data.userId + "/" + data.quizId, { withCredentials: true }).then((res) => {
            navigate("/courses/result", { state: { result: res.data, afterQuiz: true } })
          }).catch((err) => {
            console.log(err);
          })
        }).catch((err) => {
          console.log(err)
        })
      }
      let url = "http://localhost:5000/api/atempttedQuizQuestions/";
      axios.post(url, data, { withCredentials: true }, { headers: { Authorization: `Bearer ${cookie.token}` } }).then((res) => {
        console.log(res)
      }).catch((err) => {
        console.log(err)
      })
    }

    if (questions?.length > 0) {
      let newArr = [...questions]
      setCurrentQuestion(newArr.shift())
      localStorage.removeItem("counter")
      setTime(currentQuestion.time)
      setQuestions([...newArr])
      quizLengthRef.current = newArr.length
      setCurrentIndex((totalLength - questions.length) + 1)
      setEditorState(EditorState.createEmpty())
    }
    else {
      // navigate("/courses/result",{state:{userId:user.userInfo.user.id,quizId:location.state.data.id,afterQuiz:true}})
    }
  }

    //FOR TIMER
    useEffect(() => {
      timer = setInterval(() => {
        setTime(()=>{
          localStorage.setItem("counter",time-1)
          return time - 1
        })
        if (time === 0) {
          handleCurrentQuestion()
        }
      }, 1000)
  
      return () => {
        clearInterval(timer)
      }
    })
  
// FOR TIME CHECK IF QUIZ IS FINISHED
  const endQuizAfterTimeFinished = () => {
    let endTime = location.state.data.endTime
    let today = new Date();
    today = today.toLocaleString()

    let QuizFinishTime = new Date(endTime)
    QuizFinishTime = QuizFinishTime.toLocaleString()

    let newQuizFinishTime = moment(QuizFinishTime)

    if (newQuizFinishTime.isBefore(today) === true) {
      console.log('i ran 3')
      axios.post('http://localhost:5000/api/addQuizResult', { userId: user.userInfo.user.id, quizId: location.state.data.id }, { withCredentials: true }, { headers: { Authorization: `Bearer ${cookie.token}` } }).then((res) => {
        // localStorage.removeItem('counter');
        axios.get("http://localhost:5000/api/showQuizResult/" + user.userInfo.user.id + "/" + location.state.data.id, { withCredentials: true }).then((res) => {
          if (res.data.length > 0) {
            navigate("/courses/result", { state: { result: res.data, afterQuiz: true } })
          }
        }).catch((err) => {
          console.log(err);
        })
      }).catch((err) => {
        console.log(err)
      })
    }
  }



    //FOR TAB MONITORING AND SENDING IN DATABASE
    useEffect(() => {
      const handleFocus = () => {setTabHasFocus(true);};
      const handleBlur = () => {
        setCountLostFocus((state) => state = state + 1)
        setTabHasFocus(false);
        console.log('tab focus detected')
        toast.success('TAB CHANGE DETECTED', {position: toast.POSITION.TOP_CENTER,autoClose: 2000})

        let data = {
          userId: user.userInfo.user.id,
          quizId: location.state.data.id
        }
        let url = "http://localhost:5000/api/addToTabFocus/";
        axios.post(url, data, { withCredentials: true }, { headers: { Authorization: `Bearer ${cookie.token}` } }).then((res) => {
          toast.success('Updated', {
            position: toast.POSITION.TOP_CENTER,
          });
        }).catch((err) => {
          console.log(err)
        })
        
      };
  
      window.addEventListener('focus', handleFocus);
      window.addEventListener('blur', handleBlur);
  
      return () => {
        window.removeEventListener('focus', handleFocus);
        window.removeEventListener('blur', handleBlur);
      };
    }, []);
  

  //SELECTED ANSWER TO SEND IN DATABASE
  const handleSelectedDiv = (e) => {
    setSelected(e.options)
  }

  return (
    <>
      <div className={styles.modalBackground}></div>

      <div className={styles.modalContainer}>

        {!showResult &&
          <>
            <button onClick={() => navigate('/courses/quiz')}>Go back</button>
            <div className={styles.Questioncontainer}>

              <div className={styles.quizHeader}>
                <div className={styles.points}>Points&nbsp;<span>{currentQuestion.points}</span></div>
                <div className={styles.timeContainer}>
                  <p>Time Left<span className={styles.time}>{time}</span></p>
                </div>
              </div>

              <div className={styles.quizBody}>
                <div className={location.state.data.copyQuestion ? styles.noCopyAllowed : styles.copyAllowed}>
                  {currentQuestion?.questionType === 'Formula' ? <div style={{ display: "flex", justifyContent: 'flex-start' }}><MathComponent style={{ fontSize: '50px' }} tex={currentQuestion?.question} /></div>
                    : <b style={{ fontSize: '23px' }}>{currentQuestion?.question}</b>}
                </div>
                {currentQuestion?.options?.map((element) => {
                  return (
                    <>
                      <div className={selected === element.options ? styles.notSelected : styles.questionContainer} onClick={() => handleSelectedDiv(element)}>
                        {element.options}
                      </div>
                    </>
                  )
                })}
                {currentQuestion.questionType === "Subjective" &&
                  <div className={styles.editorContainer}>
                    <Editor toolbarClassName="toolbarClassName" wrapperClassName="wrapperClassName" editorClassName="editorClassName" editorState={editorState} onEditorStateChange={(newState) => { setEditorState(newState); }} wrapperStyle={{ width: '100%', border: '1px solid #88959a', minHeight: '350px', minWidth: '315px', maxHeight: '350px', overflow: 'clip', }} />
                  </div>
                }
              </div>

              <hr className={styles.hr}></hr>
              <div className={styles.quizFooter}>
                <p><b>{currentIndex}</b> of <b>{totalLength}</b> Questions</p>
                <button onClick={handleCurrentQuestion} className={styles.next}>Next Question</button>
              </div>
            </div>
          </>}

        {/* {showResult && <Result  userId={user.userInfo.user.id} quizId={location.state.data.id}/>} */}
      </div>
    </>
  )
}

export default DisplayQuiz