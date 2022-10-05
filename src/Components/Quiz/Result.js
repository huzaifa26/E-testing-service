import styles from './Result.module.css'
import { useCookies } from 'react-cookie';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';


function Result(props) {
  const location=useLocation()
  const [result,setResult]=useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    console.log(location.state.userId)
    console.log('----------------------')
    console.log(location.state.quizId)
    localStorage.removeItem("counter")
    if(location.state.cancel === true)
  {
    console.log('----------------------------------')
    console.log('quiz cancelled')
    console.log('----------------------------------')
    
  }
  else
  {
    axios.get("http://localhost:5000/api/showQuizResult/"+location.state.userId+"/"+location.state.quizId,{withCredentials:true}).then((res)=>{
      console.log(res.data)
      setResult(res.data)
      }).catch((err)=>{
      console.log(err);
    })
  }
  }, [])

  const handleCurrentQuestion =() =>{ 
    navigate('/courses/quiz')
  }
  
  return (
    <div className={styles.modalContainer}>
      <div className={styles.Questioncontainer}>
        {(location?.state?.result !== undefined && location?.state?.afterQuiz === true) ?
           <div className={styles.holder}>
           <div className={styles.heading}>QUIZ RESULT</div>
           <hr></hr>
           <div className={styles.body}>
             <div className={styles.label}>
               <h1>Total Questions: </h1>
               <p>{location.state.result[0]?.totalQuestions}</p>
             </div>
             <div className={styles.label}>
               <h1>Attempted Questions: </h1>
               <p>{location.state.result[0]?.attemptedQuestions}</p>
             </div>
             <div className={styles.label}>
               <h1>Total Marks: </h1>
               <p>{location.state.result[0]?.totalMarks}</p>  
             </div>
             <div className={styles.label}>
               <h1>Obtained Marks :</h1>
               <p>{location.state.result[0]?.obtainedMarks}</p>
             </div>
         </div>
         <div className={styles.footer}>
         <hr></hr>
         <div className={styles.buttonHolder}>
           <button onClick={handleCurrentQuestion} className={styles.next}>Close</button>
           </div>
         </div>
         </div>:null
        }
        {(location?.state !== null && result.length > 0 && location?.state?.afterQuiz === false) ?
          <div className={styles.holder}>
            <div className={styles.heading}>QUIZ RESULT</div>
            <hr></hr>
            <div className={styles.body}>
              <div className={styles.label}>
                <h1>Total Questions: </h1>
                <p>{result[0]?.totalQuestions}</p>
              </div>
              <div className={styles.label}>
                <h1>Attempted Questions: </h1>
                <p>{result[0]?.attemptedQuestions}</p>
              </div>
              <div className={styles.label}>
                <h1>Total Marks: </h1>
                <p>{result[0]?.totalMarks}</p>  
              </div>
              <div className={styles.label}>
                <h1>Obtained Marks :</h1>
                <p>{result[0]?.obtainedMarks}</p>
              </div>
          </div>
          <div className={styles.footer}>
          <hr></hr>
          <div className={styles.buttonHolder}>
            <button onClick={handleCurrentQuestion} className={styles.next}>Close</button>
            </div>
          </div>
          </div>:null
        }

        {(location?.state !== null && location?.state?.cancel === true) ?
        <div className={styles.cancelled}>
        <div className={styles.heads}>
          <h1>QUIZ CANCELLED</h1>
          <b>YOU OBTAINED 0 MARKS</b>
        </div>
        <div className={styles.buttonHolder2}>
        <hr></hr>
        <div className={styles.foot}>
          <button onClick={handleCurrentQuestion} className={styles.next}>Close</button>
        </div>
        </div>
        </div>:null}
              
      </div>
    </div>
  )
}

export default Result