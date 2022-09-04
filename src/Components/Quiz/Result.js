import styles from './Result.module.css'
import { useCookies } from 'react-cookie';
import axios from 'axios';
import React, { useEffect, useState } from 'react'


function Result(props) {
  const [cookie]=useCookies();
  const [result,setResult] = useState([])

  // useEffect(() => {
  //   axios.post('http://localhost:5000/api/addQuizResult',{userId:props.userId,quizId:props.quizId},{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}).then((res)=>{
  //     console.log(res)
      
  //   }).catch((err)=>{
  //     console.log(err)
  //   })

    
  // }, [])
  
  // useEffect(() => {
  //   axios.get("http://localhost:5000/api/showQuizResult/" + props.userId+"/"+props.quizId,{withCredentials:true}).then((res)=>
  //   {
  //   console.log(res.data)
  //   setResult(res.data)
  //   }).catch((err)=>{
  //   console.log(err);
  //   })
  
  // }, [])
  // sa?dsadadsasddasdas
  
  return (
    <div className={styles.modalContainer}>
      <div className={styles.Questioncontainer}>
        {/* <p>{result[0]?.obtainedMarks}/{result[0]?.totalMarks}</p>
        <p> {result[0]?.attemptedQuestions}/{result[0]?.totalQuestions}</p> */}

        Was having issue to be checked later
      </div>
    </div>
  )
}

export default Result