import React from 'react';
import styles from './Courses.module.css';
import {Editor} from 'draft-js';
import 'draft-js/dist/Draft.css';
import {useLocation} from "react-router-dom";
import { useSelector } from 'react-redux';
import {getCourseIdOnClickactions} from "./../../Redux/course-slice";
import { useDispatch } from 'react-redux';
import { useEffect,useState } from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import { useCookies } from 'react-cookie';

const Courses=(props) => {
  const [cookie,setCookie]=useCookies();
  const navigate=useNavigate();

  const [refreshTokenState,setRefreshToken]=useState(false);
  // useEffect(()=>{
  //   axios.get("http://localhost:5000/api/isAuthorized",{withCredentials:true}).then((res)=>{
  //     if (res.status === 200){
  //       console.log(res);
  //     }
  //   }).catch((err)=>{
  //     console.log(err);
  //     if(err.response.status === 401){
  //       navigate("/")
  //     }
  //     if(err.response.status === 403){
       
  //     }
  //   })
  // },[])


  // useEffect(()=>{
  //   axios.get("http://localhost:5000/api/isAuthorized",{withCredentials:true}).then((res)=>{
  //     if (res.status === "200"){
  //       console.log(res);
  //     }
  //   }).catch((err)=>{
  //     console.log(err);
  //     if(err.response.status === 401){
  //       navigate("/")
  //     }
  //   })
  // })

  const dispatch=useDispatch();

  const location=useLocation();
  const courseIdredux=useSelector(state => state.getCourseIdOnClick.getCourseIdOnClick);
  const courses=useSelector(state=> {return state.courses});

  return (
    <div className={styles.Main}>
    { typeof(courseIdredux) === "object" ?
    <> 
    <div className={styles.joinedHeader}>
        <h1>Courses</h1>
      </div>
      
      <div className={styles.joinedCoursesOuter}>
        <div className={styles.joinedCourses}>
          <div className={styles.flexDiv}>
            <h1 style={{fontSize:"24px",fontWeight:"900"}}>Course Name</h1>
          </div>
          {
            courses.courses.map((item,index)=>{
              return(
              <div onClick={(e)=>{dispatch(getCourseIdOnClickactions.getCourseIdOnClick(item.id))}} className={styles.flexDiv2}>
                <h1>{item.courseName}</h1>
              </div>
              )
            })
          }
        </div>
      </div>
      </>:
      <h3>Course Information(Yet to implement)</h3>
      }
    </div>
  );
}

export default Courses;