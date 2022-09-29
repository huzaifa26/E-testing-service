import React, { useEffect, useState,useRef } from 'react'
import styles from './DisplayQuiz.module.css'
import { useSelector} from 'react-redux';
import { Offline, Online } from "react-detect-offline";
import axios from 'axios';
import { useCookies } from 'react-cookie';
import Result from './Result';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState } from 'draft-js';
import { useNavigate } from 'react-router-dom';

function DisplayQuiz(props) {

const[editorState,setEditorState] = useState(EditorState.createEmpty());
const[questions,setQuestions] = useState(props.data.questions)
const[currentQuestion,setCurrentQuestion] = useState([])
const [questionState,setQuestionsState]=useState([]);
const[totalLength,setTotalLength] = useState(0)
const[currentIndex,setCurrentIndex] = useState(1)
const[selected,setSelected]=useState('')
const[time,setTime] = useState(2999)
const[showResult,setShowResult] = useState(false)
const user=useSelector(state=> state.user);
const [cookie]=useCookies();
var timer;
const [tabHasFocus, setTabHasFocus] = useState(true);
const[countLostFocus,setCountLostFocus] = useState(0)
const [triggerGetTabFocus,setTriggerGetTabFocus] = useState(false)
const navigate=useNavigate();
const quizLengthRef=useRef()

//FOR TAB MONITORING
useEffect(() => {

const handleFocus = () => {
  setTabHasFocus(true);
};

const handleBlur = () => {
  setTabHasFocus(false);
  console.log('tab lost focus')
  let data = {
    userId : user.userInfo.user.id,
    quizId : props.data.id
  }
  let url="http://localhost:5000/api/addToTabFocus/";
  axios.post(url,data,{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}).then((res)=>{
    if(res.status === 200)
    {
      setTriggerGetTabFocus((state) => !state)
    }
  }).catch((err)=>{
    console.log(err)
  })
};

// const unloadCallback = (event) => {
//   event.preventDefault();
//   event.returnValue = "";
//   console.log('closed attempt')
//   return "";
// };

window.addEventListener('focus', handleFocus);
window.addEventListener('blur', handleBlur);
// window.addEventListener("beforeunload", unloadCallback);

return () => {
  window.removeEventListener('focus', handleFocus);
  window.removeEventListener('blur', handleBlur);
  // window.removeEventListener("beforeunload", unloadCallback);
};
}, []);

//TO GET TAB FOCUS ON EVERY DETECT
useEffect(() =>
{
  axios.get("http://localhost:5000/api/getTabFocus/" + user.userInfo.user.id+"/"+props.data.id,{withCredentials:true})
  .then((res)=>{
    setCountLostFocus(res.data.data.length)
    if(res.data.data.length === 10000 || res.data.data.length>3)
    {
      console.log("--------------------------------")
      navigate("/courses/result",{state:{userId:user.userInfo.user.id,quizId:props.data.id,afterQuiz:true,cancel:true}})
    }
  }).catch((err)=>{
  console.log(err);
  })
},[triggerGetTabFocus])

//FOR GETTING INITIAL ATTEMPTED QUESTIONS
useEffect(() => {
  if(props.data.questionShuffle == 1)
  {setQuestions(props.data.questions.sort(() => Math.random() - 0.5))}
  else
  {setQuestions(props.data.questions)}

  if(props.data.answerShuffle == 1)
  {}

  if(props.data.seeAnswer == 1)
  {}

  if(props.data.detectMobile == 1)
  {}

  axios.get("http://localhost:5000/api/getAtempttedQuizQuestions/" + user.userInfo.user.id+"/"+props.data.id,{withCredentials:true})
  .then((res)=>{
    setCurrentIndex((state) => state + res?.data?.length)
    setTotalLength(questions.length)

    let attempted = questions.filter(ar => !res.data.find(rm => (rm.quizQuestionId === ar.id) ))
    if(attempted?.length === 0){
      console.log("111111111111111111111111")
      navigate("/courses/result",{state:{userId:user.userInfo.user.id,quizId:props.data.id,afterQuiz:false}})
      return
    }

    let question=attempted.shift()
    setCurrentQuestion(question)
    setQuestions([...attempted])
    quizLengthRef.current=attempted.length;
    console.log(question);
    setTime(question?.time);
    setQuestionsState([...attempted])
  }).catch((err)=>{
  console.log(err);
  })
  // TO PREVENT GOING BACK FROM QUIZ
  // window.history.pushState(null, document.title, window.location.href);
  // window.addEventListener('popstate', function (event){
  // window.history.pushState(null, document.title,  window.location.href);
  // });
}, [])

//FOR TIMER
useEffect(() => {
  timer = setInterval(() =>
  {
      setTime(time - 1)
      if(time === 0)
      {
        handleCurrentQuestion()
      }
  },1000)

  return () => {
    clearInterval(timer)
  }
})

//ONCLICK OF NEXT QUESTION
const handleCurrentQuestion =() =>{
  if(currentQuestion.questionType !== "Subjective")
  {
    console.log('no subjective')
    let data ={
      userId: user.userInfo.user.id,
      quizId: props.data.id,
      quizQuestionId: currentQuestion.id,
      correctOption:currentQuestion.correctOption,
      selectedOption:selected}

    if(selected !== ""){data.selectedOption= selected;setSelected('')}
    else{data.selectedOption = null;setSelected('')}

    if(currentQuestion.correctOption === selected){data.obtainedMarks = currentQuestion.points}
    else {data.obtainedMarks = 0}

    let url="http://localhost:5000/api/atempttedQuizQuestions/";
    axios.post(url,data,{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}).then((res)=>{
      console.log(res)
    }).catch((err)=>{
      console.log(err)
    })

    if(quizLengthRef.current === 0){
      axios.post('http://localhost:5000/api/addQuizResult',{userId:data.userId,quizId:data.quizId},{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}).then((res)=>{
        console.log(res)
        axios.get("http://localhost:5000/api/showQuizResult/"+data.userId+"/"+data.quizId,{withCredentials:true}).then((res)=>{
          console.log(res.data)
          console.log("22222222222222222222222")

          navigate("/courses/result",{state:{result:res.data,afterQuiz:true}})
          }).catch((err)=>{
          console.log(err);
        })
      }).catch((err)=>{
        console.log(err)
      })
    }
  }
  else
  {
    console.log(editorState)
    let data ={
      userId: user.userInfo.user.id,
      quizId: props.data.id,
      quizQuestionId: currentQuestion.id,
      correctOption:currentQuestion.correctOption,
      selectedOption:editorState.getCurrentContent().getPlainText(),
      obtainedMarks:0}

      if(quizLengthRef.current === 0){
        console.log({userId:data.userId,quizId:data.quizId})
        axios.post('http://localhost:5000/api/addQuizResult',{userId:data.userId,quizId:data.quizId},{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}).then((res)=>{
          console.log(res)
          axios.get("http://localhost:5000/api/showQuizResult/"+data.userId+"/"+data.quizId,{withCredentials:true}).then((res)=>{
            console.log(res.data)
            console.log("444444444444444444444444")

            navigate("/courses/result",{state:{result:res.data,afterQuiz:true}})
            }).catch((err)=>{
            console.log(err);
          })
        }).catch((err)=>{
          console.log(err)
        })
      }
      let url="http://localhost:5000/api/atempttedQuizQuestions/";
      axios.post(url,data,{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}).then((res)=>{
        console.log(res)
      }).catch((err)=>{
        console.log(err)
      })
    }
  

  if(questions?.length > 0 )
  {
    let newArr = [...questions]
    setCurrentQuestion(newArr.shift())
    setTime(currentQuestion.time)
    setQuestions([...newArr])
    quizLengthRef.current=newArr.length
    setCurrentIndex((totalLength-questions.length)+1)
  }
  else
  {
    console.log("55555555555555555555555555")
    // navigate("/courses/result",{state:{userId:user.userInfo.user.id,quizId:props.data.id,afterQuiz:true}})
  } 
}

//SELECTED ANSWER
const handleSelectedDiv = (e) =>{
  setSelected(e.options)
}

  return (
    <>
    <div className={styles.modalBackground}></div>

    <div className={styles.modalContainer}>
    
      {!showResult && 
      <>
        <button onClick={()=> props.handleStartQuiz(false)}>Go back</button>
        <div className={styles.Questioncontainer}>

          <div className={styles.quizHeader}>
            <div className={styles.points}>Points&nbsp;<span>{currentQuestion.points}</span></div>
            <div className={styles.timeContainer}>
                <p>Time Left<span className={styles.time}>{time}</span></p>
            </div>
          </div>  

          <div className={styles.quizBody}>
            <div className={props.data.copyQuestion? styles.noCopyAllowed : styles.copyAllowed}>
              <b style={{fontSize:'23px'}}>{currentQuestion.question}</b>
            </div>
            {currentQuestion?.options?.map((element) => {return (
            <>
              <div className={selected === element.options ? styles.notSelected : styles.questionContainer} onClick={() =>handleSelectedDiv(element)}>
              {element.options}
              </div>
            </>
            )})}
            {currentQuestion.questionType === "Subjective" && 
            <div className={styles.editorContainer}>
              <Editor toolbarClassName="toolbarClassName" wrapperClassName="wrapperClassName" editorClassName="editorClassName" editorState={editorState} onEditorStateChange={(newState) => { setEditorState(newState); }} wrapperStyle={{ width: '100%', border: '1px solid #88959a', minHeight: '350px', minWidth: '315px', maxHeight: '350px', overflow: 'clip', }}/>
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
        
      {/* {showResult && <Result  userId={user.userInfo.user.id} quizId={props.data.id}/>} */}
    </div>
    </>
  )
}

export default DisplayQuiz