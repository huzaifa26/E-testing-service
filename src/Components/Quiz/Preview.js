import React, { useEffect, useState } from 'react'
import styles from './Preview.module.css'
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState } from 'draft-js';
import { useLocation, useNavigate } from 'react-router-dom';
import { MathComponent } from 'mathjax-react';


function Preview() {
  const location=useLocation()
  // console.log(location.state.item)
  const[editorState,setEditorState] = useState(EditorState.createEmpty());
  const[questions,setQuestions] = useState(location.state.data.questions)
  const[currentQuestion,setCurrentQuestion] = useState([])
  const[totalLength,setTotalLength] = useState(0)
  const[currentIndex,setCurrentIndex] = useState(1)
  const[time,setTime] = useState(10000)
  var timer;
  const navigate = useNavigate()



  useEffect(() => {
        let newArr = location.state.data.questions
        setTotalLength(location.state.data.questions.length)
        let temporary =  newArr.shift()
        setQuestions([...newArr])
        setCurrentQuestion(temporary)
        // setTime(temporary.time)

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

  const handleCurrentQuestion =() =>
  {
    
    if(questions?.length > 0 )
    {
      let newArr = [...questions]
      setCurrentQuestion(newArr.shift())
      // setTime(currentQuestion.time)
      setQuestions([...newArr])
      setCurrentIndex((totalLength-questions.length)+1)
    }
    else
    {
      setQuestions(location.state.data.questions)
      navigate('/courses/quiz')
    } 
  }

  return (
    <>
    <div className={styles.modalBackground}></div>

    <div className={styles.modalContainer}>
      <div className={styles.Questioncontainer}>

          <div className={styles.quizHeader}>
            <div className={styles.points}>Points&nbsp;<span>1</span></div>
            <div className={styles.timeContainer}>
                <p>Time Left<span className={styles.time}>{time}</span></p>
            </div>
          </div>  
          <div className={currentQuestion?.questionType === "Subjective" ? styles.hello : styles.quizBody}>
            <div className={styles.noCopyAllowed}>
            {currentQuestion?.questionType === 'Formula' ? <div style={{display:"flex",justifyContent:'flex-start'}}><MathComponent style={{fontSize:'50px'}}  tex={currentQuestion?.question} /></div>
            : <b style={{fontSize:'23px'}}>{currentQuestion?.question}</b>}

            {(currentQuestion?.questionImage !== null ) &&
            <div>
              <img src={currentQuestion?.questionImage} style={{width:'400px',marginBottom:'5px'}} alt="Question Image"/>
            </div>}

            </div>
            {currentQuestion?.options?.map((element) => {return (
            <>
              <div className={styles.questionContainer } >
              {element.options}
              </div>
            </>
            )})}
            {currentQuestion.questionType === "Subjective" && 
            <div className={currentQuestion.questionImage === null ?styles.editorContainer:styles.editorContainer2}>
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
                  minHeight: currentQuestion.questionImage === null? '300px':'400px',
                  minWidth: '315px',
                  maxHeight:  currentQuestion.questionImage === null? '300px':'400px',
                  overflow: 'clip',
                }}
              />
          </div>
            }
          </div>

            <hr className={styles.hr}></hr>
          <div className={styles.quizFooter}>
            <p><b>{currentIndex}</b> of <b>{totalLength}</b> Questions</p>
            <div>
              
            <button  onClick={()=>  navigate('/courses/quiz')} className={styles.close}>Close</button>
            <button  onClick={handleCurrentQuestion} className={styles.next}>Next Question</button>
            </div>
          </div>
        </div>
    </div>
    </>
  )
}

export default Preview