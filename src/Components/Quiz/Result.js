import styles from './Result.module.css'
import { useCookies } from 'react-cookie';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';


function Result(props) {
  const location=useLocation()
  const [result,setResult]=useState([]);

  useEffect(() => {
    console.log(location.state.userId)
    console.log('----------------------')
    console.log(location.state.quizId)
    if(location.state.cancel === true)
  {
    console.log('quiz cancelled')
    console.log(location.state)
    
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

  
  
  console.log(location.state)

  return (
    <div className={styles.modalContainer}>
      <div className={styles.Questioncontainer}>
        {(location?.state?.result !== undefined && location?.state?.afterQuiz === true) ?
          <>
            <p>{location?.state?.result[0]?.obtainedMarks}/{location?.state?.result[0]?.totalMarks}</p>
            <p>{location?.state?.result[0]?.attemptedQuestions}/{location?.state?.result[0]?.totalQuestions}</p>
          </>:null
        }
        {(location?.state !== null && result.length > 0 && location?.state?.afterQuiz === false) ?
          <>
            <p>{result[0]?.obtainedMarks}/{result[0]?.totalMarks}</p>
            <p>{result[0]?.attemptedQuestions}/{result[0]?.totalQuestions}</p>
          </>:null
        }
       
      </div>
    </div>
  )
}

export default Result