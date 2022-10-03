import React, { useDebugValue } from 'react';
import styles from './Courses.module.css';
import { Editor } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getCourseIdOnClickactions } from './../../Redux/course-slice';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import PeopleIcon from '@mui/icons-material/People';
import KeyIcon from '@mui/icons-material/Key';
import QuizIcon from '@mui/icons-material/Quiz';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CountUp from 'react-countup';
import { Paper } from '@mui/material';
import { Box } from '@mui/system';
import ManageStudents from '../Settings/ManageStudents';

const Courses = (props) => {
  const [cookie, setCookie] = useCookies();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const location = useLocation();
  const courseIdredux = useSelector(
    (state) => state.getCourseIdOnClick.getCourseIdOnClick
  );
  const courseClickUserId = useSelector(
    (state) => state.courseClickUserId.courseClickUserId
  );
  const user = useSelector((state) => state.user);
  const [totalUser, setTotalUser] = useState(0);

  const [courses, setCourses] = useState([]);
  const [courseJoin, setCourseJoin] = useState([]);
  const [courseKey, setCourseKey] = useState('');
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [refreshTokenState, setRefreshToken] = useState(false);

  useEffect(() => {
    axios
      .get(
        'http://localhost:5000/api/courseSetting/' + courseIdredux,
        { withCredentials: true },
        { headers: { Authorization: `Bearer ${cookie.token}` } }
      )
      .then((res) => {
        setCourseKey(res.data.data[0].courseKey);
        setCourseDescription(res.data.data[0].courseName);
        setCourseDescription(res.data.data[0].courseDescription);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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

  useEffect(() => {
    axios
      .get(
        'http://localhost:5000/api/courses/' + user.userInfo.user.id,
        { withCredentials: true },
        { headers: { Authorization: `Bearer ${cookie.token}` } }
      )
      .then((res) => {
        setCourses(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios
      .get(
        'http://localhost:5000/api/joinedCourses/' + user.userInfo.user.id,
        { withCredentials: true },
        { headers: { Authorization: `Bearer ${cookie.token}` } }
      )
      .then((res) => {
        setCourseJoin(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios
      .get(
        'http://localhost:5000/api/enrolledLength/' + courseIdredux,
        { withCredentials: true },
        { headers: { Authorization: `Bearer ${cookie.token}` } }
      )
      .then((res) => {
        setTotalUser(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className={styles.Main}>
      {typeof courseIdredux === 'object' && (
        <>
          <div className={styles.publishedHeader}>
            <h1>Classes</h1>
          </div>

          <div className={styles.publishedCoursesOuter}>
            <div className={styles.publishedCourses}>
              <div className={styles.flexDiv}>
                <h1 style={{ fontSize: '24px', fontWeight: '900' }}>
                  Published Classes
                </h1>
              </div>
              {courses.map((item, index) => {
                return (
                  <div
                    className={styles.flexDiv2}
                    onClick={(e) => {
                      dispatch(
                        getCourseIdOnClickactions.getCourseIdOnClick(item.id)
                      );
                    }}
                  >
                    <h1>{item.courseName}</h1>
                  </div>
                );
              })}
            </div>

            <div className={styles.joinedCourses}>
              <div className={styles.flexDiv}>
                <h1 style={{ fontSize: '24px', fontWeight: '900' }}>
                  Joined Classes
                </h1>
              </div>
              {courseJoin.map((item, index) => {
                return (
                  <div
                    className={styles.flexDiv2}
                    onClick={(e) => {
                      dispatch(
                        getCourseIdOnClickactions.getCourseIdOnClick(item.id)
                      );
                    }}
                  >
                    <h1>{item.courseName}</h1>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {typeof courseIdredux !== 'object' &&
        user.userInfo.user.id == courseClickUserId && (
          <div className={styles.courseInfo}>
            <h1 className={styles.hello}>Overview</h1>
            <div className={styles.holll}>
              <div className={styles.join2}>
                <div className={styles.join}>
                  <KeyIcon style={{ fontSize: '40px' }} />
                </div>
                <div className={styles.right}>
                  <h1>J O I N I N G &nbsp; K E Y </h1>
                  <p>{courseKey}</p>
                </div>
              </div>

              <div className={styles.join2}>
                <div className={styles.totalStudents}>
                  <PeopleIcon style={{ fontSize: '40px' }} />
                </div>
                <div className={styles.right}>
                  <h1>E N R O L L E D</h1>
                  <p>{totalUser}</p>
                </div>
              </div>

              <div className={styles.join2}>
                <div className={styles.totalQuizzes}>
                  <QuizIcon style={{ fontSize: '40px' }} />
                </div>
                <div className={styles.right}>
                  <h1>Q U I Z Z E S</h1>
                  <p>{courseKey}</p>
                </div>
              </div>

              <div className={styles.join2}>
                <div className={styles.totalAssignments}>
                  <AssignmentIcon style={{ fontSize: '40px' }} />
                </div>
                <div className={styles.right}>
                  <h1>A S S I G N M E N T</h1>
                  <p>{courseKey}</p>
                </div>
              </div>
            </div>
            <div className={styles.manage}>
              <ManageStudents />
            </div>
          </div>
        )}

      {typeof courseIdredux !== 'object' &&
        user.userInfo.user.id !== courseClickUserId && (
          <div className={styles.courseInfo2}>
            <h3>Description</h3>
            <p>{courseDescription}</p>
          </div>
        )}
    </div>
  );
};

export default Courses;
