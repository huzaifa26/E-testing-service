import React, { useEffect, useState } from 'react'
import styles from './Preview.module.css'
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState } from 'draft-js';

function Preview(props) {
  const[editorState,setEditorState] = useState(EditorState.createEmpty());
  const[questions,setQuestions] = useState(props.data.questions)
  const[currentQuestion,setCurrentQuestion] = useState([])
  const[totalLength,setTotalLength] = useState(0)
  const[currentIndex,setCurrentIndex] = useState(1)
  const[time,setTime] = useState(29)
  var timer;


  useEffect(() => {
        let newArr = props.data.questions
        setTotalLength(props.data.questions.length)
        let temporary =  newArr.shift()
        setQuestions([...newArr])
        setCurrentQuestion(temporary)
        setTime(temporary.time)

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
      setTime(currentQuestion.time)
      setQuestions([...newArr])
      setCurrentIndex((totalLength-questions.length)+1)
    }
    else
    {
      props.handlePreviewStart(false)
      setQuestions(props.data.questions)
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

          <div className={styles.quizBody}>
            <div className={styles.noCopyAllowed}>
              <b style={{fontSize:'23px'}}>{currentQuestion?.question}</b>
            </div>
            {currentQuestion?.options?.map((element) => {return (
            <>
              <div className={styles.questionContainer } >
              {element.options}
              </div>
            </>
            )})}
            {currentQuestion.questionType === "Subjective" && 
            <div className={styles.editorContainer}>
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
            <div>
              
            <button  onClick={()=> props.handlePreviewStart()} className={styles.close}>Close</button>
            <button  onClick={handleCurrentQuestion} className={styles.next}>Next Question</button>
            </div>
          </div>
        </div>
    </div>
    </>
  )
}

export default Preview