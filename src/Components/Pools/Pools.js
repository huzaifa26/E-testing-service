import styles from './Pools.module.css';
<<<<<<< HEAD

import React, { useState } from 'react';
=======
import React, { useState,useEffect } from 'react';
>>>>>>> master
import ShowPool from './ShowPool';
import Buildpool from './Buildpool';
import CreateCategoryModal from './CreateCategoryModal';
import { useDispatch,useSelector } from 'react-redux';
import axios from 'axios';
import { poolsActions } from '../../Redux/pools-slice';
import { courseId_NameActions,courseCategoriesActions } from '../../Redux/course-slice';
import { useCookies } from 'react-cookie';
import { ToastContainer, toast } from 'react-toastify';

function Pools() {
  const dispatch=useDispatch();
  const [showPool, setshowPool] = useState(true);
  const [createPool, setcreatePool] = useState(false);
  const [showModal,setShowModal]=useState(false);

  const user=useSelector(state=> state.user);
  const change=useSelector(state=> state.pools.change);
  const courseIdredux=useSelector(state => state.getCourseIdOnClick.getCourseIdOnClick);

  const openModalHandler=()=>{
    setcreatePool(false);
    setShowModal(true);
    dispatch(poolsActions.change(!change))
  }

  const closeModalHandler=()=>{
    setShowModal(false);
    setcreatePool(true);
    setShowModal(false);
    dispatch(poolsActions.change(!change))
  }

  const getRequests=()=>{
    if(user.userInfo.hasOwnProperty("user") === true){
      let link='http://localhost:5000/api/getCourseName/' + user.userInfo.user.id;
      axios.get(link,{withCredentials:true}).catch((err)=>{
        console.log(err);
      })
    }
  }

  useEffect(()=>{
    getRequests();
    if(user.userInfo.hasOwnProperty("user") === true){
      let link='http://localhost:5000/api/getCourseCategories/' + courseIdredux;
      axios.get(link,{withCredentials:true}).then((res)=>{
        dispatch(courseCategoriesActions.courseCategories(res.data.data));
      }).catch((err)=>{
        console.log(err);
      })
    }
  },[showModal])

  useEffect(()=>{
    let link='http://localhost:5000/api/getCourseName/' + user.userInfo.user.id;
    axios.get(link,{withCredentials:true}).then((res)=>{
      dispatch(courseId_NameActions.courseIdName(res.data.data));
    }).catch((err)=>{
      console.log(err);
    })
  },[])

  const changeView=()=>{
    setshowPool(true);
    setcreatePool(false); 
  }


  return (
    <>
    {showModal &&
      <CreateCategoryModal closeModalHandler={closeModalHandler}></CreateCategoryModal>
    }
      <div className={styles.pool}>
        <div className={styles.intro}>
          <h1>Pools</h1>
          <p>
            Pool is a collection of questions that is stored for repeated use.
          </p>
        </div>
        <div className={styles.poolsBar}>
          <div className={styles.allButton}>

          <button  className={`${styles.button0} ${showPool && styles.buttonActive}`}
            onClick={() => {
              dispatch(poolsActions.change(!change))
              setshowPool(true);
              setcreatePool(false);
            }}>
            Show Pool
          </button>
          <button style={{marginLeft:"3px"}} className={`${styles.button0} ${createPool && styles.buttonActive}`}
            onClick={() => {
              dispatch(poolsActions.change(!change))
              setshowPool(false);
              setcreatePool(true);
            }}>
            Create Pool
          </button>
          <button className={`${styles.button2} ${showModal && styles.buttonActive}`}
            onClick={openModalHandler}>
            Create Category
          </button>
          </div>

          {showPool && <ShowPool />}
          {createPool && <Buildpool changeView={changeView}/>}
        </div>
      </div>
      </>
  );
}

export default Pools;
