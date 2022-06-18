import React, { useState,useEffect } from 'react';
import styles from './Showpool.module.css';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { MathComponent } from 'mathjax-react';


function ShowPool() {
  const user=useSelector(state=> state.user)
  console.log();
  // 
  const [courseId, setCourseId] = useState('0');
  const [isCourseSelected,setIsCourseSelected]=useState(false);

  const publishCourses=useSelector(state=>{return state.courseId_Name.courseIdName});

  // const allQuestions = useSelector((state) => {
  //   console.log(state.pools.allQuestions)
  //   return state.pools.allQuestions;
  // });

  const [allQuestions,setAllQuestions]=useState([]);

  const handleShow = (e) => {
    setCourseId(e.target.value);
    setIsCourseSelected(true)
  };

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

  return (
    <div>
      <div className={styles.poolsMain}>
      <div className={styles.poolsCategory}>
        <label >Select Course:</label>
        <select onChange={handleShow}>
          <option value={0} selected>
            All Courses
          </option>
          {publishCourses.map((value) => {
            return <option value={value.id}>{value.courseName}</option>;
          })}
        </select>
      </div>
      {isCourseSelected && <div className={styles.poolsCategory}>
        <label>
          Select Category:
        </label>
        <select onChange={handleShow}>
          <option value="" selected disabled hidden>
            Choose Category
          </option>
          {publishCourses.map((value) => {
            return <option value={value.id}>{value.courseName}</option>;
          })}
        </select>
      </div>}
      </div>

    {courseId === '0' ? allQuestions.map((item, index) => {
        index++;
            return (
              <div className={styles.displayQuestions}>
                <p className={styles.courseName}><strong>Course Name:</strong>{item.courseName}</p>
                <div className={styles.questionHeader}>
                  <h1>{index}.</h1>
                  {/* <h2 style={{fontSize:"20px",fontWeight:'500'}} className={styles.question}><MathComponent tex={item.question} /></h2> */}
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
          }) : allQuestions.filter((data) => {return +data.courseId === +courseId;}).map((item, index) => {
            index++;
            console.log(item)
            return (
              <div className={styles.displayQuestions}>
                <p className={styles.courseName}><strong>Course Name:</strong>{item.courseName}</p>
                <div className={styles.questionHeader}>
                  <h1>{index}.</h1>
                  <h2 style={{fontSize:"20px",fontWeight:'500'}} className={styles.question}><MathComponent tex={item.question} /></h2>
                  
                  {/* <h2 style={{fontSize:"20px",fontWeight:'500'}} className={styles.question}>{item.question}</h2> */}
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
          })}
        </div>
  );
}

export default ShowPool;
