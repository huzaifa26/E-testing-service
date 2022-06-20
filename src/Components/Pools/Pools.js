import styles from './Pools.module.css';
import React, { useState,useEffect } from 'react';
import ShowPool from './ShowPool';
import Buildpool from './Buildpool';
import CreateCategoryModal from './CreateCategoryModal';
import { useDispatch,useSelector } from 'react-redux';
import axios from 'axios';
import { courseId_NameActions,courseCategoriesActions } from '../../Redux/course-slice';
import { ToastContainer, toast } from 'react-toastify';

function Pools() {
  const dispatch=useDispatch();
  const [showPool, setshowPool] = useState(true);
  const [createPool, setcreatePool] = useState(false);
  const [showModal,setShowModal]=useState(false);

  const user=useSelector(state=> state.user);
  const courseIdredux=useSelector(state => state.getCourseIdOnClick.getCourseIdOnClick);

  console.log(typeof(courseIdredux));

  const openModalHandler=()=>{
    setShowModal(true);
  }

  const closeModalHandler=()=>{
    setShowModal(false);
    toast.success('Category Created', {
      position: toast.POSITION.TOP_RIGHT,
    })
  }

  const getRequests=()=>{
    if(user.userInfo.hasOwnProperty("user") === true){
      let link='http://localhost:5000/api/getCourseName/' + user.userInfo.user.id;
      axios.get(link).then((res)=>{
        console.log(res.data.data);
        dispatch(courseId_NameActions.courseIdName(res.data.data));
      }).catch((err)=>{
        console.log(err);
      })
    }
  }

  const getCourseCategories=()=>{
    if(user.userInfo.hasOwnProperty("user") === true){
      let link='http://localhost:5000/api/getCourseCategories/' + courseIdredux;
      axios.get(link).then((res)=>{
        console.log(res.data.data);
        dispatch(courseCategoriesActions.courseCategories(res.data.data));
      }).catch((err)=>{
        console.log(err);
      })
    }
  }

  useEffect(()=>{
    getRequests();
    getCourseCategories();
  },[showModal])

  // useEffect(()=>{
  //   let link='http://localhost:5000/api/getCourseName/' + user.userInfo.user.id;
  //   axios.get(link).then((res)=>{
  //     console.log(res.data.data);
  //     dispatch(courseId_NameActions.courseIdName(res.data.data));
  //   }).catch((err)=>{
  //     console.log(err);
  //   })
  // },[])

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

          <button className={styles.button0}
            onClick={() => {
              setshowPool(true);
              setcreatePool(false);
            }}>
            Show Pool
          </button>
          <button className={styles.button2}
            onClick={() => {
              setshowPool(false);
              setcreatePool(true);
            }}>
            Create Pool
          </button>
          <button className={styles.button2}
            onClick={openModalHandler}>
            Create Category
          </button>
          </div>

          {showPool && <ShowPool />}
          {createPool && <Buildpool />}
        </div>
      </div>
      <ToastContainer autoClose={1000}/>

      </>
  );
}

export default Pools;
