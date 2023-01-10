import React, { useEffect, useState, useRef } from 'react'
import styles from './DisplayQuiz.module.css'
import { useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { ContentState, convertFromHTML, EditorState } from 'draft-js';
import { MathComponent } from 'mathjax-react';
import { toast } from 'react-toastify';
import moment from "moment";
import axios from 'axios';
import { IconButton, Tooltip } from '@mui/material';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';

let speechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

speechRecognition = new speechRecognition();
speechRecognition.continuous = true;
speechRecognition.interimResults = true;
speechRecognition.lang = 'en-US';

function DisplayQuiz() {
  const location = useLocation()

  if (location.state !== null) {
    // Do nothing
  } else if (location.state === null) {
    let quizQuestionLS = localStorage.getItem("quizQuestion");
    quizQuestionLS = JSON.parse(quizQuestionLS)
    let data = { data: quizQuestionLS, from: null }
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
  const user = useSelector(state => state.user);
  const [cookie] = useCookies();
  const [tabHasFocus, setTabHasFocus] = useState(true);
  const [countLostFocus, setCountLostFocus] = useState(0)
  const navigate = useNavigate();
  const quizLengthRef = useRef()
  var timer;

  //FOR GETTING INITIAL ATTEMPTED QUESTIONS
  useEffect(() => {
    if (location.state.data.questionShuffle == 1) { setQuestions(location.state.data.questions.sort(() => Math.random() - 0.5)) }
    else { setQuestions(location.state.data.questions) }

    if (location.state.data.detectMobile == 1) { }

    axios.get("http://localhost:5000/api/showQuizResult/" + user.userInfo.user.id + "/" + location.state.data.id, { withCredentials: true })
      .then((res) => {
        if (res.data.length === 0) {
          endQuizAfterTimeFinished()
        }
      })
      .catch((err) => {
        console.log(err);
      })

    axios.get("http://localhost:5000/api/getAtempttedQuizQuestions/" + user.userInfo.user.id + "/" + location.state.data.id, { withCredentials: true }).then((res) => {
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

      if (location.state.from === "QuizTable") {
        if (localStorage.getItem("counter") === undefined) {
          setTime(question?.time);
        }
        if (localStorage.getItem("counter") !== undefined) {
          let oldTime = localStorage.getItem("counter")
          oldTime = JSON.parse(oldTime)
          setTime(() => +oldTime)
          console.log('time set 3')
        }
        if (localStorage.getItem("counter") === null) {
          setTime(question?.time);
          console.log('time set 4')
        }
      }
      else {
        console.log('time set 5')
        let oldTime = localStorage.getItem("counter")
        oldTime = JSON.parse(oldTime)
        setTime(() => +oldTime)
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
        selectedOption: selected,
        subjective: false,
        points: currentQuestion.points
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
        axios.post('http://localhost:5000/api/addQuizResult', { userId: data.userId, quizId: data.quizId }, { withCredentials: true }, { headers: { Authorization: `Bearer ${cookie.token}` } }).then((res) => {
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

    //IF ITS SUBJECTIVE
    else {

      let data = {
        userId: user.userInfo.user.id,
        quizId: location.state.data.id,
        quizQuestionId: currentQuestion.id,
        correctOption: currentQuestion.correctOption,
        selectedOption: editorState.getCurrentContent().getPlainText(),
        obtainedMarks: 0,
        subjective: true,
        points: currentQuestion.points
      }

      let url = "http://localhost:5000/api/atempttedQuizQuestions/";
      axios.post(url, data, { withCredentials: true }, { headers: { Authorization: `Bearer ${cookie.token}` } }).then((res) => {
        console.log('success');
        console.log(res)
      }).catch((err) => {
        console.log(err)
      })

      // else {

      //   console.log(currentQuestion.points);
      //   let data2 = {
      //     sentence1: currentQuestion.correctOption,
      //     sentence2: editorState.getCurrentContent().getPlainText(),
      //   }
      //   function getMarks(score, maxMarks) {
      //     return score * maxMarks;
      //   }
      //   axios.post("http://127.0.0.1:8000/question-grading/", data2)
      //     .then((res) => {
      //       console.log(res.data.grade)
      //       const abc = getMarks(res.data.score, currentQuestion.points)
      //       data.obtainedMarks = abc
      //       let url = "http://localhost:5000/api/atempttedQuizQuestions/";
      //       axios.post(url, data, { withCredentials: true }, { headers: { Authorization: `Bearer ${cookie.token}` } }).then((res) => {
      //         console.log('success');
      //         console.log(res)
      //       }).catch((err) => {
      //         console.log(err)
      //       })

      //     })
      //     .catch(e => console.log(e))


      if (quizLengthRef.current === 0) {
        console.log('inside haha');
        setTimeout(function () {
          axios.post('http://localhost:5000/api/addQuizResult', { userId: data.userId, quizId: data.quizId }, { withCredentials: true }, { headers: { Authorization: `Bearer ${cookie.token}` } }).then((res) => {
            axios.get("http://localhost:5000/api/showQuizResult/" + data.userId + "/" + data.quizId, { withCredentials: true }).then((res) => {
              navigate("/courses/result", { state: { result: res.data, afterQuiz: true } })
            }).catch((err) => {
              console.log(err);
            })
          }).catch((err) => {
            console.log(err)
          })
        }, 1000);
      }


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

    // else {
    // navigate("/courses/result",{state:{userId:user.userInfo.user.id,quizId:location.state.data.id,afterQuiz:true}})
    // }
  }

  //FOR TIMER
  useEffect(() => {
    timer = setInterval(() => {
      endQuizAfterTimeFinished()
      setTime(() => {
        localStorage.setItem("counter", time - 1)
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
      axios.post('http://localhost:5000/api/addQuizResult', { userId: user.userInfo.user.id, quizId: location.state.data.id }, { withCredentials: true }, { headers: { Authorization: `Bearer ${cookie.token}` } }).then((res) => {
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
    const handleFocus = () => { setTabHasFocus(true); };
    const handleBlur = () => {
      setCountLostFocus((state) => state = state + 1)
      setTabHasFocus(false);
      console.log('tab focus detected')
      let data = {
        userId: user.userInfo.user.id,
        quizId: location.state.data.id
      }
      let url = "http://localhost:5000/api/addToTabFocus/";
      axios.post(url, data, { withCredentials: true }, { headers: { Authorization: `Bearer ${cookie.token}` } }).then((res) => {
        toast.warn('Tab Change Detected', {
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

  // const [isListening, setIsListening] = useState(false);
  // const [note, setNote] = useState(null);
  // const [savedNotes, setSavedNotes] = useState([]);
  // const transcriptRef = useRef(null);

  const [transcripts, setTranscripts] = useState([]);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    speechRecognition.onstart = () => {
      setIsListening(true);
    };

    speechRecognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          let localTranscript = null;
          setTranscripts((prevTranscripts) => {
            let newArr = [...prevTranscripts, transcript];
            newArr = newArr.join(',');
            newArr = newArr.replace(',', ' ');
            localTranscript = newArr;
            return [newArr];
          });
          const blocksFromHTML = convertFromHTML(localTranscript)
          const contentState = ContentState.createFromBlockArray(blocksFromHTML)
          setEditorState(EditorState.createWithContent(contentState));
        }
      }
    };

    speechRecognition.onerror = (event) => {
      console.error(event.error);
    };

    speechRecognition.onend = () => {
      setIsListening(false);
    };

    return () => {
      speechRecognition.stop();
    };
  }, []);

  const startListening = () => {
    speechRecognition.start();
  };

  const stopListening = () => {
    speechRecognition.stop();
  };


  // useEffect(() => {
  //   handleListen();
  // }, [isListening]);

  // const handleListen = () => {
  //   if (isListening) {
  //     mic.start();
  //     mic.onend = () => {
  //       mic.start();
  //     };
  //   }
  //   else {
  //     mic.stop();
  //     mic.onend = (event) => {
  //       console.log(event)
  //       handleSaveNote()
  //     };
  //   }
  //   mic.onstart = () => {
  //     console.log("Mics on");
  //   };

  //   mic.onresult = (event) => {
  //     const transcript = Array.from(event.results)
  //       .map((result) => result[0])
  //       .map((result) => result.transcript)
  //       .join("");
  //     setNote((prev) => {
  //       console.log(prev + " " + transcript);
  //       return transcript
  //     });

  //     const blocksFromHTML = convertFromHTML(transcript)
  //     const contentState = ContentState.createFromBlockArray(blocksFromHTML)
  //     setEditorState(EditorState.createWithContent(contentState));

  //     mic.onerror = (event) => {
  //       console.log(event.error);
  //     };
  //   };
  // };

  // const handleSaveNote = () => {
  //   setIsListening(false)
  //   setSavedNotes((savedNotes) => {
  //     let arr = [...savedNotes, note]
  //     console.log(arr)
  //     arr = arr.join()
  //     arr = arr.replace(",", '');
  //     console.log(arr)
  //     return arr
  //   });

  //   console.log([savedNotes, note]);

  // };

  return (
    <>
      <div className={styles.modalBackground}></div>
      <div className={styles.modalContainer}>
        <div className={styles.Questioncontainer}>

          <div className={styles.quizHeader}>
            <div className={styles.points}><span>Points&nbsp;{currentQuestion.points}</span></div>
            <div className={styles.timeContainer}>
              <p>Time Left<span className={styles.time}>{time}</span></p>
            </div>
          </div>

          <div className={(currentQuestion?.questionType !== "Subjective" && styles.quizBody) || ((currentQuestion.questionImage === null && currentQuestion?.questionType === "Subjective") && styles.hello2) || ((currentQuestion.questionImage !== null && currentQuestion?.questionType === "Subjective") && styles.hello)}>
            <div className={location?.state?.data?.copyQuestion ? styles.noCopyAllowed : styles.copyAllowed}>
              {currentQuestion?.questionType === 'Formula' ? <div style={{ display: "flex", justifyContent: 'flex-start', paddingTop: '20px' }}><MathComponent style={{ fontSize: '50px' }} tex={currentQuestion?.question} /></div>
                : <b className={styles.pp} >{currentQuestion?.question}</b>}

              {(currentQuestion?.questionImage !== null) &&
                <div className={styles.image3}>
                  <img src={currentQuestion?.questionImage} className={currentQuestion.questionImage !== null && currentQuestion?.questionType === "Subjective" ? styles.image2 : styles.image} alt="Question Image" />
                </div>}

            </div>
            {currentQuestion?.options?.map((element) => {
              return (
                <>
                  <div className={selected === element.options ? styles.notSelected : styles.questionContainer} onClick={() => handleSelectedDiv(element)}>
                    <span> {element.options}</span>
                  </div>
                </>
              )
            })}
            {currentQuestion.questionType === "Subjective" &&
              <>
                <div className={styles.Icon}>

                  {!isListening && <Tooltip placement="top" arrow title="Answer by Recording"><IconButton onClick={() => startListening()} color="primary" aria-label="add to shopping cart"><KeyboardVoiceIcon onClick={() => setIsListening((prev) => !prev)} style={{ color: 'black', fontSize: '30px', pointerEvents: "none" }} /></IconButton></Tooltip>}
                  {isListening && <Tooltip placement="top" arrow title="Stop" ><IconButton data-recording={isListening} onClick={() => stopListening()} color="primary" aria-label="add to shopping cart"><KeyboardVoiceIcon onClick={() => setIsListening((prev) => !prev)} style={{ color: 'red', fontSize: '30px', pointerEvents: "none" }} /></IconButton></Tooltip>}

                </div>
                <p></p>
                <div className={currentQuestion.questionImage === null ? styles.editorContainer : styles.editorContainer2}>

                  <Editor
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    editorState={editorState}
                    onEditorStateChange={(newState) => {
                      setEditorState(newState);
                    }}
                    wrapperStyle={{
                      width: '100%',
                      border: '1px solid #88959a',
                      minHeight: currentQuestion.questionImage === null ? '390px' : '300px',
                      minWidth: '315px',
                      maxWidth: currentQuestion.questionImage === null ? '100%' : '100%',
                      maxHeight: currentQuestion.questionImage === null ? '250px' : '250px',
                      overflow: 'clip',
                    }}
                  />

                </div>
              </>
            }
          </div>
          <hr className={styles.hr}></hr>
          <div className={styles.quizFooter}>
            <p className={styles.pp2}><b>{currentIndex}</b> of <b>{totalLength}</b> Questions</p>
            <button onClick={handleCurrentQuestion} className={styles.next}>Next Question</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default DisplayQuiz