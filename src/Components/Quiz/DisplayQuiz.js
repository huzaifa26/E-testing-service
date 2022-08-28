import React, { useEffect, useState } from 'react'
import styles from './DisplayQuiz.module.css'
import Countdown from 'react-countdown';
import { Offline, Online } from "react-detect-offline";


function DisplayQuiz(props) {

  const[questions,setQuestions] = useState(props.data.questions)
  const[currentQuestion,setCurrentQuestion] = useState([])
  const[totalLength,setTotalLength] = useState(0)
  const[currentIndex,setCurrentIndex] = useState(1)
  const[selected,setSelected]=useState('')
  const[totalPoints,setTotalPoints] = useState(0)
  const[obtainedPoints,setObtainedPoints] = useState(0)
  const[time,setTime] = useState(20)

 
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

    let newArr = [...questions]
    setCurrentQuestion(newArr.shift())
    setQuestions([...newArr])
~
    setTotalLength(questions.length)

    questions?.forEach(element=>{
      setTotalPoints(state=>state+element.points)
    })


    // TO PREVENT GOING BACK FROM QUIZ
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener('popstate', function (event){
    window.history.pushState(null, document.title,  window.location.href);
    });
  }, [])


  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a complete state
      return 0
    } 
    else {
      // Render a countdown
      return (
        <span>
          {seconds}
        </span>
      );
    }
  };

  const handleCurrentQuestion =() =>
  {
    if(questions?.length > 0 )
    {

      let newArr = [...questions]
      setCurrentQuestion(newArr.shift())
      
      setQuestions([...newArr])
      setCurrentIndex((totalLength-questions.length)+1)
      setTime(currentQuestion.time)
    }
    else
    {
      alert('completed')
    }
  }

  const handleCorrect = (e) =>
  {
    setSelected(e.target.value)
  }

  return (
    <>
    <div className={styles.modalBackground}>
    </div>

    <div className={styles.modalContainer}>
        {/* <Offline >Youre offline</Offline> */}
        <button onClick={()=> props.handleStartQuiz(false)}>Ok</button>
        <div className={styles.Questioncontainer}>
             
            <div className={styles.quizHeader}>
                <div className={styles.points}>Points&nbsp;<span>{currentQuestion.points}</span></div>
                <div className={styles.timeContainer}>
                    <p>Time Left<span className={styles.time}><Countdown date={Date.now() + (time*1000)} renderer={renderer} /></span></p>
                </div>
            </div>  
            <div className={styles.quizBody}>
                <div className={props.data.copyQuestion? styles.noCopyAllowed : styles.copyAllowed}>
                  <p>{currentQuestion.question}</p>
                </div>
                {currentQuestion?.options?.map((element) => {return (
                  <>
                <input
                type="radio"
                value={element.options}
                // defaultChecked={false}
                checked={selected===element.options}
                onChange={(event) =>
                  handleCorrect(event)
                }
                name="correct"
              /><p>{element.options}</p>
              </>
                )})}
            </div>
        <p>
          <span>{currentIndex}</span>out of<span>{totalLength}</span>
        </p>
        <button onClick={handleCurrentQuestion}>Next Question</button>
        </div>
    </div>
    </>
  )
}

export default DisplayQuiz
