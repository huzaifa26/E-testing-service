import React, { useState,useEffect  } from 'react'
import { useSelector } from 'react-redux';
import styles from './ImportPool.module.css'
import axios from 'axios';

function ImportPool({close}) {

   const user=useSelector(state=> state.user)
   const courseIdredux=useSelector(state => state.getCourseIdOnClick.getCourseIdOnClick);

   const [poolCategory,setPoolCategory] = useState([])
   const [poolQuestion,setPoolQuestions]  = useState([])


   useEffect(()=>{
    if(user.userInfo.hasOwnProperty("user") === true){
      let link='http://localhost:5000/api/getCourseCategories/' + courseIdredux;
      axios.get(link,{withCredentials:true}).then((res)=>{
        setPoolCategory(res.data.data);
      }).catch((err)=>{
        console.log(err);
      })
    }

    if(user.userInfo.hasOwnProperty("user") === true){
        axios.get("http://localhost:5000/api/poolQuestions2/" + user.userInfo.user.id+"/"+courseIdredux,{withCredentials:true}).then((res)=>{
        console.log(res.data)
        // setPoolQuestions(res.data);
        // console.log(res.data)
        }).catch((err)=>{
        console.log(err);
        })
    }
    
    
  },[close])

  return (
    <>
        <div className={styles.modalBackground} onClick={() => close(false)}></div>
        <div className={styles.modalContainer}>
            <div className={styles.header}>
            <p>Find Questions</p>
            <i class="bi bi-x-circle" onClick={() => close(false)}></i>
            </div>
            <hr></hr>

            <div className={styles.body}>
                <div className={styles.left}>
                {poolCategory.map((value) => {
                     return <div className={styles.categoryName}>{value.categoryName}</div>;
                })}

                </div>
                <hr></hr>
                <div className={styles.right}>
                    bbbb
                </div>

            </div>
        </div>
    </>
  )
}

export default ImportPool