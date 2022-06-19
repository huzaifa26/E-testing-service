import React, { useState,useEffect } from 'react';
import styles from './Showpool.module.css';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { MathComponent } from 'mathjax-react';


function ShowPool() {
  const user=useSelector(state=> state.user)
  const courseIdredux=useSelector(state => state.getCourseIdOnClick.getCourseIdOnClick);
  const courseCategoriesredux=useSelector(state => state.courseCategories.courseCategories);

  const publishCourses=useSelector(state=>{return state.courseId_Name.courseIdName});
  const [allQuestions,setAllQuestions]=useState([]);


  const getRequests=()=>{
    if(user.userInfo.hasOwnProperty("user") === true){
      axios.get("http://localhost:5000/api/poolQuestions/" + user.userInfo.user.id).then((res)=>{
        setAllQuestions(res.data);
      }).catch((err)=>{
        console.log(err);
      })
    }
  }

  useEffect(()=>{
    getRequests();
  },[])

  const showCategoriesHandler=(e)=>{
    console.log(e.target.value);
  }

  return (
    <div>
      <div className={styles.poolsMain}>
      {/* <div className={styles.poolsCategory}>
        <label >Select Course:</label>
        <select onChange={handleShow}>
          <option value={0} selected>
            All Courses
          </option>
          {publishCourses.map((value) => {
            return <option value={value.id}>{value.courseName}</option>;
          })}
        </select>
      </div> */}
      <div className={styles.poolsCategory}>
        <label>
          Select Category:
        </label>
        <select onChange={showCategoriesHandler}>
          <option value="" selected disabled hidden>
            Choose Category
          </option>
          {courseCategoriesredux.map((value) => {
            return <option value={value.id}>{value.categoryName}</option>;
          })}
        </select>
      </div>
      </div>

          {allQuestions.filter((data) => {return +data.courseId === +courseIdredux;}).map((item, index) => {
            index++;
            return (
              <div className={styles.displayQuestions}>
                <p className={styles.courseName}><strong>Course Name:</strong>{item.courseName}</p>
                <div className={styles.questionHeader}>
                  <h1>{index}.</h1>
                  <MathComponent tex={item.question} />
                  
                  <h2 style={{fontSize:"20px",fontWeight:'500'}} className={styles.question}>{item.question}</h2>
                </div>
                <div class={styles.container}>
                  <div style={{padding: '2px 25px'}}>
                    <ul className={styles.ul}>
                      {item.questionType !== "Subjective" && item.options.map((i)=>{
                        return(
                          <li className={item.correctOption === i.options.toLowerCase() && styles.abc}>{i.options}</li>
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
          })
          }
        </div>
  );
}

export default ShowPool;
