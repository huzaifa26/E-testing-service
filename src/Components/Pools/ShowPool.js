import React, { useState,useEffect } from 'react';
import styles from './Showpool.module.css';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { MathComponent } from 'mathjax-react';
import { ToastContainer, toast } from 'react-toastify';
import { useCookies } from 'react-cookie';

function ShowPool() {
  const [cookie]=useCookies();
  const user=useSelector(state=> state.user)
  const courseIdredux=useSelector(state => state.getCourseIdOnClick.getCourseIdOnClick);
  const courseCategoriesredux=useSelector(state => state.courseCategories.courseCategories);
  const [changeState,setChangeState]=useState(false);

  const publishCourses=useSelector(state=>{return state.courseId_Name.courseIdName});
  const [allQuestions,setAllQuestions]=useState([]);

  const getRequest=()=>{
    if(user.userInfo.hasOwnProperty("user") === true){
      axios.get("http://localhost:5000/api/poolQuestions/" + user.userInfo.user.id,{headers: { Authorization: `Bearer ${cookie.token}`}}).then((res)=>{
        setAllQuestions(res.data);
      }).catch((err)=>{
        console.log(err);
      })
    }
  }

  useEffect(()=>{
    if(user.userInfo.hasOwnProperty("user") === true){
      axios.get("http://localhost:5000/api/poolQuestions/" + user.userInfo.user.id,{headers: { Authorization: `Bearer ${cookie.token}`}}).then((res)=>{
        setAllQuestions(res.data);
      }).catch((err)=>{
        console.log(err);
      })
    }
  },[])

  const showCategoriesHandler=(e)=>{
    console.log(e.target.value);
  }

  const deleteQuestionHanler=(id)=>{
    let data={id:id}
    if(user.userInfo.hasOwnProperty("user") === true){
      axios.post("http://localhost:5000/api/deletepoolQuestions",data,{headers: { Authorization: `Bearer ${cookie.token}`}}).then((res)=>{
      toast.success('Question Deleted', {
          position: toast.POSITION.TOP_RIGHT,
      })
      getRequest();
      }).catch((err)=>{
        toast.error('Question Deletion Failed', {
          position: toast.POSITION.TOP_RIGHT,
        })
      })
    }
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
            console.log(item);
            return (
              <div className={styles.displayQuestions}>
                <p className={styles.courseName}><strong>Course Name: &nbsp;</strong>{item.courseName}</p>
                <div className={styles.questionHeader}>
                  <h1>{index}.</h1>
                  {item.isMathjax === 1 ? 
                    <MathComponent style={{flex:"1"}} tex={item.question} />:
                    <h2 style={{fontSize:"20px",fontWeight:'500'}} className={styles.question}>{item.question}</h2>
                  }

                </div>
                {item.questionImage !== null &&
                    <div style={{marginLeft:"50px"}}>
                      <img src={item.questionImage} alt="Question Image"/>
                    </div>
                  }
                <div class={styles.container}>
                  <div style={{padding: '2px 25px'}}>
                    <ul className={styles.ul}>
                      {item.questionType !== "Subjective" && item.questionType !== "TRUE/FALSE" && item.options.map((i)=>{
                        return(
                          <li className={item.correctOption === i.options.toLowerCase() && styles.abc}>{i.options}</li>
                        )
                      })}
                    </ul>
                    <br/>
                    <p>Answer: <strong>{item.correctOption}</strong></p>
                  </div>
                </div>
                <div className={styles.footer1}>
                  <button className={styles.button0} onClick={(e)=>{deleteQuestionHanler(item.id)}}>Delete</button>
                  <p className={styles.questionType}><span>{item.questionType}</span></p>
                </div>
              </div>
            );
          })
          }
        </div>
  );
}

export default ShowPool;
