import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ConfirmDelete.module.css'
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux';


function ConfirmDelete({close}) {

  const navigate = useNavigate()
  const courseIdredux=useSelector(state => state.getCourseIdOnClick.getCourseIdOnClick);
  
  const [cookie,setCookie]=useCookies();

  const handleDelete = () =>{
    axios.post("http://localhost:5000/api/deleteCourse",{courseIdredux},{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}
    ).then((res)=>{
        console.log(res)
        if(res.status === 200)
        {
          navigate('/dashboard')
        }
    }).catch((err)=>{
        console.log(err);
    })

  }

  return (
    <>
        <div className={styles.modalBackground}></div>
        <div className={styles.modalContainer}>
            
            <h3 style={{textAlign:'center'}}>Are you sure you want to delete this course</h3>
            <div className={styles.buttonHolder}>
            <button onClick={() => close(false)} className={styles.cancel}>Cancel</button>
            <button onClick={handleDelete} className={styles.delete}>Delete</button>
            </div>
        </div>
    </>
  )
}

export default ConfirmDelete