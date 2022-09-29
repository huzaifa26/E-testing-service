import axios from 'axios';
import React, { useState } from 'react';
import { useEffect,useCallback } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import Modal from '../Modal/Modal';
import Navbar from '../Navbar/Navbar';
import CreateCourse from './CreateCourse';
import styles from './Dashboard.module.css';
import {courseActions,getCourseIdOnClickactions,courseJoinActions} from "./../../Redux/course-slice";
import Courses from '../Courses/Courses';
import { Link,useLocation,useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { userActions } from './../../Redux/user-slice'; 
import { courseClickUserIdActions } from './../../Redux/course-slice';
import { async } from '@firebase/util';


const Dashboard=(props)=> {
  const navigate=useNavigate();
  const [cookie,setCookie]=useCookies();

  
  const location = useLocation();
  const dispatch=useDispatch();
  const [openModal,setOpenModal] =useState(false)
  const [showDashboard,setShowDashboard]=useState(true);
  // const [showCreateCourse,setShowCreateCourse]=useState(false);
  const [showCourse,setShowCourse]=useState(false);
  const [courseIdState,setCourseIdState]=useState(false);
  
  const user=useSelector(state=> state.user);
  
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
  const joinhandle=()=>{
    setOpenModal(true);
  }

  const createCourseHandler=()=>{
    // setShowDashboard(false);
    // setShowCreateCourse(true)
    navigate('/dashboard/createCourse')
  }

  const [courses,setCourses] = useState([])
  const [courseJoin,setCourseJoin] = useState([])
  const getCourses=()=>{
      axios.get("http://localhost:5000/api/courses/"+user.userInfo.user.id,{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}
      ).then((res)=>{
        console.log(res);
        setCourses(res.data.data)
      }).catch((err)=>{
        console.log(err);
      })
  }

  const getJoinedCourses=()=>{
      axios.get("http://localhost:5000/api/joinedCourses/"+user.userInfo.user.id,{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}
      ).then((res)=>{
        console.log(res);
        setCourseJoin(res.data.data)
      }).catch((err)=>{
        console.log(err);
      })
  }


  const showDashboardHandler=useCallback(()=>{
    getCourses();
    getJoinedCourses();
  },[])

  const [getdata,setgetdata]=useState(false);


  useEffect(()=>{
    if(user.userInfo.hasOwnProperty("user") === true){
      axios.get("http://localhost:5000/api/user",{withCredentials:true}, {headers: { Authorization: `Bearer ${cookie.token}`}}).then((res)=>{
        dispatch(userActions.userInfo(res.data));
        // const serializedStore = JSON.stringify(res.data);
        // window.localStorage.setItem('store', serializedStore);
        setgetdata(!getdata);
      }).catch((err)=>{
        console.log(err);
      })
    }
  },[])


  useEffect(()=>{
        axios.get("http://localhost:5000/api/courses/"+user.userInfo.user.id,{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}
        ).then((res)=>{
          setCourses(res.data.data)
        }).catch((err)=>{
          console.log(err);
        })
      },[]);
      
      useEffect(()=>{
        axios.get("http://localhost:5000/api/joinedCourses/"+user.userInfo.user.id,{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}
        ).then((res)=>{
          setCourseJoin(res.data.data)
      }).catch((err)=>{
        console.log(err);
      })
},[openModal]);

  return (
    <>
    {/* {showCreateCourse && <CreateCourse showDashboardHandler={showDashboardHandler}/>} */}

    {showCourse && <Courses id={courseIdState}/>}

    {showDashboard &&<div className={openModal ?  styles.mainDashboard1:styles.mainDashboard}>
      <div>
        <div>
          <div className={styles.joinedHeader} >
          <h1>Published Classes</h1>
          <button onClick={createCourseHandler}>Create Class</button>
          </div>
          <div  className={styles.joinedCourses}>      
            {courses.map((item) => {
              return( 
              <div onClick={(e)=>{
              dispatch(getCourseIdOnClickactions.getCourseIdOnClick(item.id));
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
            {courseJoin.map((item) => {
              return( 
              <div className={styles.joinedList}  onClick={(e)=>{
                dispatch(getCourseIdOnClickactions.getCourseIdOnClick(item.id));
                dispatch(courseClickUserIdActions.courseClickUserId(item.userId))
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
    </div>}
    </>
  );
}

export default Dashboard;