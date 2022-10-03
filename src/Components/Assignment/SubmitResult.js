import React, { useEffect, useState } from 'react'
import styles from './SubmitResult.module.css'
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux';


function SubmitResult({item,closeStudentResult}) {

    const [obtainedMarks,setObtainedMarks] = useState(-1)
    const user=useSelector(state=> state.user);
    const [cookie,setCookie]=useCookies();

    useEffect(() => {
    axios.get("http://localhost:5000/api/getStudentResult/"+user.userInfo.user.id+'/'+item.id,{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}
    ).then((res)=>{
        setObtainedMarks(res.data.data[0].obtainedMarks)
        // setStudentResult(res?.data?.data)
    }).catch((err)=>{
        console.log(err);
    })
    }, [])

  return (
    <>
        <div className={styles.modalBackground} onClick={() => closeStudentResult(false)}></div>
        <div className={styles.modalContainer}>

        {/* <div className={styles.holder}> */}
            <div className={styles.heading}>ASSIGNMENT RESULT</div>
            <hr></hr>
            <div className={styles.body}>
                {obtainedMarks === -1 && <div className={styles.label}><p>To be assigned</p></div>}

                {obtainedMarks > -1 && <>
              <div className={styles.label}>
                <h1>Total Marks: </h1>
                <p>10</p>  
              </div>
              <div className={styles.label}>
                <h1>Obtained Marks :</h1>
                <p>{obtainedMarks}</p>
              </div>
              </>}
          </div>
          <div className={styles.footer}>
          <hr></hr>
          <div className={styles.buttonHolder}>
            <button onClick={() => closeStudentResult(false)} className={styles.next}>Close</button>
            </div>
          </div>
          {/* </div> */}
        </div>
    </>
  )
}

export default SubmitResult