import React, { useState,useEffect } from 'react';
import styles from './Showpool.module.css';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { MathComponent } from 'mathjax-react';
import { ToastContainer, toast } from 'react-toastify';
import { useCookies } from 'react-cookie';
import Editpool from './Editpool';


function ShowPool() {
  const [cookie]=useCookies();
  const change=useSelector(state=> state.pools.change);
  const user=useSelector(state=> state.user)
  const courseIdredux=useSelector(state => state.getCourseIdOnClick.getCourseIdOnClick);
  const [changeState,setChangeState]=useState(false);
  const [allQuestions,setAllQuestions]=useState([]);
  const [OpenEdit,setOpenEdit] =useState(false)
  const [dataEdit,setDataEdit]= useState([])


  const openEdit=(e)=>{
    setDataEdit(e)
    setOpenEdit(true);
  }


  useEffect(()=>{
    if(user.userInfo.hasOwnProperty("user") === true){
      axios.get("http://localhost:5000/api/poolQuestions/" + user.userInfo.user.id,{withCredentials:true}).then((res)=>{
        // console.log(res.data)
        setAllQuestions(res.data);
        console.log(res.data)
      }).catch((err)=>{
        console.log(err);
      })
    }
    console.log('i ran')
  },[changeState])

  const deleteQuestionHanler=(id)=>{
    setChangeState(state =>!state);
    console.log(id)
    let data={id:id}
    if(user.userInfo.hasOwnProperty("user") === true){
      axios.post("http://localhost:5000/api/deletepoolQuestions",data,{withCredentials:true}).then((res)=>{
      toast.success('Question Deleted', {
          position: toast.POSITION.TOP_RIGHT,
      })
      setChangeState((state) => !state)
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
      {/* <div className={styles.poolsCategory}>
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
      </div> */}
      </div>

          {allQuestions.filter((data) => {return +data.courseId === +courseIdredux;}).map((item, index) => {
            index++;
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
                      <img src={item.questionImage} className={styles.imgg} alt="Question Image"/>
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
                  <button className={styles.edit} onClick={(e)=>openEdit(item)}>Edit</button>
                  <button className={styles.button0} onClick={(e)=>{deleteQuestionHanler(item.id)}}>Delete</button>
                  <p className={styles.questionType}><span>{item.questionType}</span></p>
                </div>
                {OpenEdit && <Editpool closeModal={setOpenEdit} dataEdit1={dataEdit}/>}
              </div>
            );
          })
          }
        </div>
  );
}

export default ShowPool;
