import axios from 'axios';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import Modal from '../Modal/Modal';
import Navbar from '../Navbar/Navbar';
import CreateCourse from './CreateCourse';
import styles from './Dashboard.module.css';
import {courseActions} from "./../../Redux/course-slice";

const joinedCourses =
[
  {
    id:2,
    name: 'Database'
  }
]

function Dashboard() {
  const dispatch=useDispatch();
  
  const [openModal,setOpenModal] =useState(false)
  const [showDashboard,setShowDashboard]=useState(true);
  const [showCreateCourse,setShowCreateCourse]=useState(false);

  const courses=useSelector(state=> state.courses)

  const joinhandle=()=>{
    setOpenModal(true);
  }

  const createCourseHandler=()=>{
    setShowDashboard(false);
    setShowCreateCourse(true)
  }

  const showDashboardHandler=()=>{
    setShowDashboard(true);
    setShowCreateCourse(false);
  }

  useEffect(()=>{
    axios.get("http://localhost:5000/api/courses").then((res)=>{
      dispatch(courseActions.courses(res.data.data));
    }).catch((err)=>{
      console.log(err);
    })
  },[])

  return (
    <>
    {showCreateCourse && <CreateCourse showDashboardHandler={showDashboardHandler}/>}

    {showDashboard &&<div className={openModal ?  styles.mainDashboard1:styles.mainDashboard}>
      <div>
        <div>
          <div className={styles.joinedHeader} >
          <h1>Published Courses</h1>
          <button onClick={createCourseHandler}>Create Course</button>
          </div>
          <div className={styles.joinedCourses}>      
            {courses.courses.map((item) => {
              return( 
              <div className={styles.joinedList}>
                <img src={item.imageUrl}></img>
                <h2>{item.courseName}</h2>
              </div>
              )})}     
          </div>
        </div>

        <div className={styles.joinedHeader} >
        <h1>Joined Courses</h1>
        <button onClick={joinhandle}>Join Course</button>
        </div>
        <div className={styles.joinedCourses}>      
          {joinedCourses.map((item) => {return( 
          <div className={styles.joinedList}>{item.name}</div>)})}     
        </div>
        {openModal && <Modal closeModal={setOpenModal}/>}
      </div>
    </div>}
    </>
  );
}

export default Dashboard;
