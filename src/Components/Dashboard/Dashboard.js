import React, { useState } from 'react';
import { useEffect,useCallback } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import Modal from './Modal';
import Navbar from '../Navbar/Navbar';
import CreateCourse from './CreateCourse';
import styles from './Dashboard.module.css';
import {courseActions,getCourseIdOnClickactions,courseJoinActions} from "./../../Redux/course-slice";
import Courses from '../Courses/Courses';
import { Link,useLocation,useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { userActions } from './../../Redux/user-slice'; 
import { courseClickUserIdActions } from './../../Redux/course-slice';
import { async } from '@firebase/util';
import { toast } from 'react-toastify';



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


  const modelOpenHandler =  useCallback((value) => {
    if(value === true)
    {
      setOpenModal(false)
    }
    else
    {
      axios.get("http://localhost:5000/api/joinedCourses/"+user.userInfo.user.id,{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}
      ).then((res)=>{
        setCourseJoin(res?.data?.data)
        toast.success('Class joined successfully', {
          position: toast.POSITION.TOP_RIGHT,
        });
        setOpenModal(false)
    }).catch((err)=>{
      console.log(err);
    })
    }
    
    
  },[openModal])
  
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
    console.log('i triggered')
        axios.get("http://localhost:5000/api/courses/"+user.userInfo.user.id,{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}
        ).then((res)=>{
          setCourses(res?.data?.data)
        }).catch((err)=>{
          console.log(err);
        })
      },[]);
      
      useEffect(()=>{
        axios.get("http://localhost:5000/api/joinedCourses/"+user.userInfo.user.id,{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}
        ).then((res)=>{
          setCourseJoin(res?.data?.data)
          console.log(res?.data?.data)
      }).catch((err)=>{
        console.log(err);
      })
},[modelOpenHandler,openModal]);

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
          <hr style={{marginLeft:'20px'}}></hr>

          <div  className={styles.joinedCourses}>  
            {courses.length === 0 && <div className={styles.no}><p>No Class Created Yet</p></div>}
            {courses.map((item) => {
              return( 
              <div  onClick={(e)=>{
              dispatch(getCourseIdOnClickactions.getCourseIdOnClick(item.id));
              dispatch(courseClickUserIdActions.courseClickUserId(item.userId))
              // console.log(item.userId)
              navigate("/courses")}} className={styles.joinedList}>
                <div className={styles.subMain}>
                {item.imageUrl !== "" &&
                  <img src={item.imageUrl}></img>
                }
                <div className={styles.h2}>
                <h2>{item.courseName}</h2>

                </div>
                </div>
              </div>
              )})}     
          </div>
        </div>

        <div className={styles.joinedHeader} >
        <h1>Joined Classes</h1>
        <button onClick={joinhandle}>Join Class</button>
        </div>
        <hr style={{marginLeft:'20px'}}></hr>
        <div className={styles.joinedCourses}>  
            {courseJoin.length === 0 && <div className={styles.no}><p>No Class Joined Yet</p></div>}
            {courseJoin.map((item) => {
              // {item.blocked !==0 &&}
              return (item.blocked === 0) ? 

              <div className={styles.joinedList}  onClick={(e)=>{
                dispatch(getCourseIdOnClickactions.getCourseIdOnClick(item.id));
                dispatch(courseClickUserIdActions.courseClickUserId(item.userId))
                navigate("/courses")}}>
                  <div className={styles.subMain}>
                {item.imageUrl !== "" &&
                  <img src={item.imageUrl}></img>
                }
                <div className={styles.h2}>
                <h2>{item.courseName}</h2>
                </div>
                </div>
              </div>:
              <div className={styles.joinedList}  onClick={(e)=>{toast.error("You're blocked by the teacher", { position: toast.POSITION.TOP_RIGHT, });}}>
                <div className={styles.subMain}>
                {item.imageUrl !== "" &&
                  <img className={styles.imgg} src={item.imageUrl}></img>
                }
                </div>
                <div className={styles.h2}>
                <h2>{item.courseName}</h2>
                </div>
              </div>
              })}     
          </div>
        {openModal && <Modal closeModal={modelOpenHandler}/>}
      </div>
    </div>}
    </>
  );
}

export default Dashboard;