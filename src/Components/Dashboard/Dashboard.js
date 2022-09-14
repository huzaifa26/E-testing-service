import axios from 'axios';
import React, { useState } from 'react';
import { useEffect,useCallback } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import Modal from '../Modal/Modal';
<<<<<<< HEAD
=======
import Navbar from '../Navbar/Navbar';
import CreateCourse from './CreateCourse';
>>>>>>> master
import styles from './Dashboard.module.css';
import {courseActions,getCourseIdOnClickactions,courseJoinActions} from "./../../Redux/course-slice";
import Courses from '../Courses/Courses';
import { Link,useLocation,useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { userActions } from './../../Redux/user-slice'; 
import { courseStatusActions } from './../../Redux/course-slice';
import { courseClickUserIdActions } from './../../Redux/course-slice';
import { async } from '@firebase/util';

<<<<<<< HEAD
const joinedCourses =
[
  {id:2,
  name: 'Database'},
  {id:3,
  name: 'Assembly Language'},
  {id:2,
  name: 'Database'},
  {id:3,
  name: 'Assembly Language'},
  {id:2,
  name: 'Database'},
  {id:3,
  name: 'Assembly Language'},
  {id:2,
  name: 'Database'},
  {id:3,
  name: 'Assembly Language'},
  {id:2,
  name: 'Database'},
  {id:3,
  name: 'Assembly Language'},
  {id:2,
  name: 'Database'},
  {id:2,
  name: 'Database'},
  {id:2,
  name: 'Database'},

]

const colors=[
  '#B9F8D3','#e9f47f6e','#8969b462','#a6e8ec9a'
]

let count = 0

function Dashboard() {
=======

const Dashboard=(props)=> {
  const navigate=useNavigate();
  const [cookie,setCookie]=useCookies();

  // useEffect(()=>{
  // axios.get("http://localhost:5000/api/isAuthorized",{withCredentials:true},{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}).then((res)=>{
  //   if (res.status === 200){
  //     console.log(res);
  //   }
  // }).catch((err)=>{
  //   console.log(err);
  //   if(err.response.status === 401){
  //     navigate("/")
  //   }
  // })
  // },[])

  const location = useLocation();
  const dispatch=useDispatch();
>>>>>>> master
  const [openModal,setOpenModal] =useState(false)
  const [showDashboard,setShowDashboard]=useState(true);
  const [showCreateCourse,setShowCreateCourse]=useState(false);
  const [showCourse,setShowCourse]=useState(false);
  const [courseIdState,setCourseIdState]=useState(false);

  const courses=useSelector(state=> state.courses);
  const courseJoin=useSelector(state=> state.courseJoin);
  const user=useSelector(state=> state.user);

  const joinhandle=()=>{
    setOpenModal(true);
  }

  const createCourseHandler=()=>{
    setShowDashboard(false);
    setShowCreateCourse(true)
  }

  const getCourses=()=>{
    if(user?.userInfo?.hasOwnProperty("user") === true){
      axios.get("http://localhost:5000/api/courses/"+user.userInfo.user.id,{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}
      ).then((res)=>{
        console.log(res);
        dispatch(courseActions.courses(res.data.data));
      }).catch((err)=>{
        console.log(err);
      })
    } 
  }

  const getJoinedCourses=()=>{
    if(user?.userInfo?.hasOwnProperty("user") === true){
      axios.get("http://localhost:5000/api/joinedCourses/"+user.userInfo.user.id,{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}
      ).then((res)=>{
        console.log(res);
        dispatch(courseActions.joinedCourses(res.data.data));
      }).catch((err)=>{
        console.log(err);
      })
    } 
  }


  const showDashboardHandler=useCallback(()=>{
    setShowDashboard(true);
    setShowCreateCourse(false);
    getCourses();
    getJoinedCourses();
  },[])

  const [getdata,setgetdata]=useState(false);


  useEffect(()=>{
    if(user.userInfo.hasOwnProperty("user") === true){
      axios.get("http://localhost:5000/api/user",{withCredentials:true}, {headers: { Authorization: `Bearer ${cookie.token}`}}).then((res)=>{
        dispatch(userActions.userInfo(res.data));
        setgetdata(!getdata);
      }).catch((err)=>{
        console.log(err);
      })
    }
  },[])


  useEffect(()=>{
      if(user?.userInfo?.hasOwnProperty("user") === true){
        axios.get("http://localhost:5000/api/courses/"+user.userInfo.user.id,{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}
        ).then((res)=>{
          dispatch(courseActions.courses(res.data.data));
        }).catch((err)=>{
          console.log(err);
        })
      } 
  },[]);

  useEffect(()=>{
    if(user?.userInfo?.hasOwnProperty("user") === true){
      axios.get("http://localhost:5000/api/joinedCourses/"+user.userInfo.user.id,{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}
      ).then((res)=>{
        console.log(res);
        dispatch(courseJoinActions.joinedCourses(res.data.data));
        
      }).catch((err)=>{
        console.log(err);
      })
    } 
},[openModal]);

  return (
<<<<<<< HEAD
    <div className={openModal ?  styles.mainDashboard1:styles.mainDashboard}>
    <div>
      <div className={styles.joinedHeader} >
      <h1>Joined Courses</h1>
      <button onClick={joinhandle}>Join Course</button>
      </div>
      <div className={styles.joinedCourses}>      
          {joinedCourses.map((item,i) => {
            count++;
            if(count === 4){count = 0 }
            return(<div style={{backgroundColor:colors[count]}} className={styles.joinedList}>{item.name}</div>)})}     
      </div>
      {openModal && <Modal closeModal={setOpenModal}/>}
    </div>
=======
    <>
    {showCreateCourse && <CreateCourse showDashboardHandler={showDashboardHandler}/>}
>>>>>>> master

    {showCourse && <Courses id={courseIdState}/>}

    {showDashboard &&<div className={openModal ?  styles.mainDashboard1:styles.mainDashboard}>
      <div>
        <div>
          <div className={styles.joinedHeader} >
          <h1>Published Classes</h1>
          <button onClick={createCourseHandler}>Create Class</button>
          </div>
          <div  className={styles.joinedCourses}>      
            {courses.courses.map((item) => {
              return( 
              <div onClick={(e)=>{
              dispatch(getCourseIdOnClickactions.getCourseIdOnClick(item.id));
              dispatch(courseStatusActions.courseStatus('published'))
              dispatch(courseClickUserIdActions.courseClickUserId(item.userId))
              // console.log(item.userId)
              navigate("/courses")}} className={styles.joinedList}>
                {item.imageUrl !== "" &&
                  <img src={item.imageUrl}></img>
                }
                <h2>{item.courseName}</h2>
              </div>
              )})}     
          </div>
        </div>

        <div className={styles.joinedHeader} >
        <h1>Joined Classes</h1>
        <button onClick={joinhandle}>Join Class</button>
        </div>
        <div  className={styles.joinedCourses}>      
            {courseJoin.joinedCourses.map((item) => {
              return( 
              <div className={styles.joinedList}  onClick={(e)=>{
                dispatch(getCourseIdOnClickactions.getCourseIdOnClick(item.id));
                dispatch(courseStatusActions.courseStatus('joined'))
                dispatch(courseClickUserIdActions.courseClickUserId(item.userId))
                // console.log(item.userId)
                navigate("/courses")}}>
                {item.imageUrl !== "" &&
                  <img src={item.imageUrl}></img>
                }
                <h2>{item.courseName}</h2>
              </div>
              )})}     
          </div>
        {openModal && <Modal closeModal={setOpenModal}/>}
      </div>
<<<<<<< HEAD
      <div className={styles.joinedCourses}>      
          {joinedCourses.map((item,i) => {
            count++;
            if(count === 4){count = 0 }
            return(<div style={{backgroundColor:colors[count]}} className={styles.joinedList}>{item.name}</div>)})}     
      </div>
  
    </div>
    </div>
=======
    </div>}
    </>
>>>>>>> master
  );
}

export default Dashboard;