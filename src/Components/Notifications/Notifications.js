import styles from './Notifications.module.css';
import React from 'react';
import Navbar from '../Navbar/Navbar';
import {useEffect} from "react";
import axios from 'axios';
import {useNavigate} from "react-router-dom";

const Notification=() => {

  const navigate=useNavigate();

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
  // },[])

  return (
    <div className={styles.Main}>
      Notification
    </div>
  );
}

export default Notification;
