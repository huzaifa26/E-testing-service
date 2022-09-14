import React, { useEffect, useRef, useState } from 'react'
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
  const navigate=useNavigate();

  const[editorState,setEditorState] = useState(EditorState.createEmpty());
  const[questions,setQuestions] = useState(props.data.questions)
  const[currentQuestion,setCurrentQuestion] = useState([])
  const[totalLength,setTotalLength] = useState(0)
  const[currentIndex,setCurrentIndex] = useState(1)
  const[selected,setSelected]=useState('')
  const[time,setTime] = useState(100);
  const[showResult,setShowResult] = useState(false)
  const user=useSelector(state=> state.user);
  const [cookie]=useCookies();
  var timer;
  const [questionState,setQuestionsState]=useState([]);
  const quizLengthRef=useRef()
 
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

    if(user.userInfo.hasOwnProperty("user") === true){
      axios.get("http://localhost:5000/api/getAtempttedQuizQuestions/" + user.userInfo.user.id+"/"+props.data.id,{withCredentials:true}).then((res)=>{
        setCurrentIndex((state) => state + res?.data?.length)
        setTotalLength(questions.length)

        let attempted = questions.filter(ar => !res.data.find(rm => (rm.quizQuestionId === ar.id) ))
        if(attempted?.length === 0){
          alert("1")
          navigate("/courses/result",{state:{userId:user.userInfo.user.id,quizId:props.data.id,afterQuiz:false}});
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
    } 
    // TO PREVENT GOING BACK FROM QUIZ
    // window.history.pushState(null, document.title, window.location.href);
    // window.addEventListener('popstate', function (event){
    // window.history.pushState(null, document.title,  window.location.href);
    // });
  }, [])

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

  const handleCurrentQuestion =() =>{
    if(currentQuestion.questionType !== "Subjective"){
      console.log('no subjective')
      let data ={
        userId: user.userInfo.user.id,
        quizId: props.data.id,
        quizQuestionId: currentQuestion.id,
        correctOption:currentQuestion.correctOption,
        selectedOption:selected
      }
  
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

      console.log()
      if(quizLengthRef.current === 0){
        axios.post('http://localhost:5000/api/addQuizResult',{userId:data.userId,quizId:data.quizId},{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}).then((res)=>{
          console.log(res)
          axios.get("http://localhost:5000/api/showQuizResult/"+data.userId+"/"+data.quizId,{withCredentials:true}).then((res)=>{
            console.log(res.data)
            navigate("/courses/result",{state:{result:res.data,afterQuiz:true}})
            }).catch((err)=>{
            console.log(err);
          })
        }).catch((err)=>{
          console.log(err)
        })
      }
    }
    else{
      console.log(editorState)
      let data ={
        userId: user.userInfo.user.id,
        quizId: props.data.id,
        quizQuestionId: currentQuestion.id,
        correctOption:currentQuestion.correctOption,
        selectedOption:editorState.getCurrentContent().getPlainText(),
        obtainedMarks:0
      }
      
      console.log()
      if(quizLengthRef.current === 0){
        console.log({userId:data.userId,quizId:data.quizId})
        axios.post('http://localhost:5000/api/addQuizResult',{userId:data.userId,quizId:data.quizId},{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}).then((res)=>{
          console.log(res)
          axios.get("http://localhost:5000/api/showQuizResult/"+data.userId+"/"+data.quizId,{withCredentials:true}).then((res)=>{
            console.log(res.data)
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
      navigate("/courses/result",{state:{userId:user.userInfo.user.id,quizId:props.data.id,afterQuiz:true}})
    } 
  }
  
  const handleSelectedDiv = (e) =>
  {
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
            <div className={styles.points}>Points&nbsp;<span>{currentQuestion?.points}</span></div>
            <div className={styles.timeContainer}>
                <p>Time Left<span className={styles.time}>{time}</span></p>
            </div>
          </div>  

          <div className={styles.quizBody}>
            <div className={props.data.copyQuestion? styles.noCopyAllowed : styles.copyAllowed}>
              <b style={{fontSize:'23px'}}>{currentQuestion?.question}</b>
            </div>
            {currentQuestion?.options?.map((element) => {return (
            <>
              <div className={selected === element.options ? styles.notSelected : styles.questionContainer} onClick={() =>handleSelectedDiv(element)}>
              {element.options}
              </div>
            </>
            )})}
            {currentQuestion?.questionType === "Subjective" && 
            <div className={styles.editorContainer}>
              <Editor
                // toolbar={config}
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
                  minHeight: '350px',
                  minWidth: '315px',
                  maxHeight: '350px',
                  overflow: 'clip',
                }}
              />
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
    </div>
    </>
  )
}

export default DisplayQuiz






{/* 
                <input
                type="radio"
                value={element.options}
                // defaultChecked={false}
                checked={selected===element.options}
                onChange={(event) =>
                  handleCorrect(event)
                }
                name="correct"
              /><p>{element.options}</p> */}

              
  // const handleCorrect = (e) =>
  // {
  //   setSelected(e.target.value)
  // }


  {/* {
        showResult && <p><button onClick={()=> props.handleStartQuiz(false)}>Ok</button>To be implemented out of {props.data.totalPoints}</p>
        } */}

      {/* <Offline >Youre offline</Offline> */}
  