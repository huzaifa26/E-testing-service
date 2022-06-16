import React, { useState } from 'react';
import styles from './Showpool.module.css';
import { useSelector } from 'react-redux';

function ShowPool() {
  const [courseId, setCourseId] = useState('0');

  const publishCourses=useSelector(state=>{return state.courseId_Name.courseIdName});


  const allQuestions = useSelector((state) => {
    console.log(state.pools.allQuestions)
    return state.pools.allQuestions;
  });

  const handleShow = (e) => {
    setCourseId(e.target.value);
  };

  return (
    <div>
      <div className={styles.poolsMain}>
      <div className={styles.poolsCategory}>
        <label htmlFor="dog-names">Select Course &nbsp;&nbsp;&nbsp;&nbsp;:</label>
        <select onChange={handleShow}>
          <option value={0} selected>
            All Courses
          </option>
          {publishCourses.map((value) => {
            return <option value={value.id}>{value.courseName}</option>;
          })}
        </select>
      </div>
      </div>

    {courseId === '0' ? allQuestions.map((item, i) => {
        i++;
        console.log(item)
            return (
              <div className={styles.displayQuestions}>
                <p className={styles.courseName}><strong>Course Name:</strong>{item.courseName}</p>
                <div className={styles.questionHeader}>
                  <h1>{i}.</h1>
                  <h2 style={{fontSize:"20px",fontWeight:'500'}} className={styles.question}>{item.question}</h2>
                </div>
                <div class={styles.container}>
                  <div style={{padding: '2px 25px'}}>
                    <ul className={styles.ul}>
                      {item.questionType !== "Subjective" && item.options.map((i)=>{
                        return(
                          <li className={item.correctOption === i.toLowerCase() && styles.abc}>{i}</li>
                        )
                      })}
                    </ul>
                    <br/>
                    <p>Answer: <strong>{item.correctOption}</strong></p>
                  </div>
                </div>
                <p className={styles.questionType}><span>{item.questionType}</span></p>
              </div>
            );
          }) : allQuestions.filter((data) => data.courseId === courseId).map((item, i) => {
            i++;
            console.log(item)
            return (
              <div className={styles.displayQuestions}>
                <p className={styles.courseName}><strong>Course Name:</strong>{item.courseName}</p>
                <div className={styles.questionHeader}>
                  <h1>{i}.</h1>
                  <h2 style={{fontSize:"20px",fontWeight:'500'}} className={styles.question}>{item.question}</h2>
                </div>
                <div class={styles.container}>
                  <div style={{padding: '2px 25px'}}>
                    <ul className={styles.ul}>
                      {item.questionType !== "Subjective" && item.options.map((i)=>{
                        return(
                          <li className={item.correctOption === i && styles.abc}>{i}</li>
                        )
                      })}
                    </ul>
                    <br/>
                    <p>Answer: <strong>{item.correctOption}</strong></p>
                  </div>
                </div>
                <p className={styles.questionType}><span>{item.questionType}</span></p>
              </div>
            );
          })}
        </div>
  );
}

export default ShowPool;
