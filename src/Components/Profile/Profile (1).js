import React, { useState,useEffect } from 'react'
import styles from './Profile.module.css'
import { useDispatch, useSelector } from 'react-redux';
import {Storage} from "../Utils/firebase";
import {ref,uploadBytes,getDownloadURL,uploadBytesResumable} from "firebase/storage"
import { useRef } from 'react';
import axios from 'axios';
import {ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { userActions } from '../../Redux/user-slice';

const Profile=() => {
    const dispatch=useDispatch();
    const [cookie]=useCookies();
    const navigate=useNavigate();
    
    // useEffect(()=>{
    //     axios.get("http://localhost:5000/api/isAuthorized",{withCredentials:true}).then((res)=>{
    //       if (res.status === "200"){
    //         console.log(res);
    //       }
    //     }).catch((err)=>{
    //       console.log(err);
    //       if(err.response.status === 401){
    //         navigate("/")
    //       }
    //     })
    //   },[])

    const formRef=useRef();
    const user = useSelector((state) => state.user.userInfo);

    const [image , setImage] = useState('');
    const [imageURL , setImageURL] = useState('');

    const fileHandler= async (e)=>{
        setImage(e.target.files[0]);
        const last_dot = e.target.files[0].name.lastIndexOf('.')
        const ext = e.target.files[0].name.slice(last_dot + 1)
        const name = e.target.files[0].name.slice(0, last_dot)
  
        if(image == null)
            return;
  
        toast(0,{autoClose:false, toastId: 1})
  
        try{
          console.log("uploading")
          const storageRef = ref(Storage, `/courseImages/${e.target.files[0].name}`);
          const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);
          console.log("uploaded");
          uploadTask.on('state_changed', 
          (snapshot) => {
            const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            toast.update(1, {
              // position: toast.POSITION.TOP_CENTER,
              render: 'Uploading ' + p.toFixed(0) + '%',
            });
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
            }
          }, 
          (error) => {
              console.log(error);
          }, 
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
              setImageURL(url);
              toast.update(1, {
                type: toast.TYPE.SUCCESS,
                render: 'File uploaded',
                autoClose:1000
              });
            });
          }
        );
      }catch(err){
          console.log(err);
      }
    }

    const editUserFormSubmitHanlder=(e)=>{
        e.preventDefault();
        let updatedUser={
            fullName:formRef.current.name.value,
            phoneNumber:formRef.current.phone.value,
            userAddress:formRef.current.address.value,
            userImg:imageURL || null
        }
        console.log(updatedUser);

        if((updatedUser.fullName !== user.user.fullName) || (updatedUser.userAddress !== user.user.userAddress) || (updatedUser.phoneNumber !== user.user.phoneNumber) || (updatedUser.userImg !== user.user.userImg)){
            console.log("update")
        } else {
            console.log("same");
        }

    axios.post("http://localhost:5000/api/user",updatedUser,{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}).then((res)=>{
        console.log(res);
        if(res.status === 200){
            console.log(res);
            toast.success('User Updated Successfully', {
                position: toast.POSITION.TOP_RIGHT,
            });
            axios.get("http://localhost:5000/api/user",{withCredentials:true}).then((res)=>{
                console.log(res.data.user.id);
                dispatch(userActions.userInfo(res.data));
                // const serializedStore = JSON.stringify(res.data);
                // window.localStorage.setItem('store', serializedStore);
      
            })
            navigate("/dashboard");
        }
    }).catch((err)=>{
        console.log(err);
        if(err.status === 500){
            toast.error('Cannot register Course', {
                position: toast.POSITION.TOP_RIGHT,
            });
        } 
    })
    }

    let imgSrc="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOIgbiAwf6mBkjE6iVQuxHMAHMXlcYvkshKJ9Tx-bexaRCbpR7WJNs7t_qh3Z4I8qe8HQ&usqp=CAU";
    if (user.userImg !== null){
        imgSrc=user.user.userImg;
    } else if(imageURL === "" && user.userImg === null){
        imgSrc="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOIgbiAwf6mBkjE6iVQuxHMAHMXlcYvkshKJ9Tx-bexaRCbpR7WJNs7t_qh3Z4I8qe8HQ&usqp=CAU";
    } 
    if(imageURL !== ""){
        imgSrc = imageURL;
    }


    console.log(user.user.userImg);

  return (
    <div className={styles.main}>
        <div className={styles.leftTop}>
            
        <div className={styles.h1}>
                <h1>P R O F I L E</h1>
        </div>

    <form ref={formRef} onSubmit={editUserFormSubmitHanlder} className={styles.left}>
        <h1>Details</h1>
        <div className={styles.leftContainer}>
            <div className={styles.infoContainer}>
                <label>Name</label>
                <input type="text" size="32" defaultValue={user.user.fullName} name="name" />
            </div>
            <div className={styles.infoContainer}>
                <label>Email</label>
                <input disabled type="text" size="32" value={user.user.email} name="email" />
            </div>
            <div className={styles.infoContainer}>
                <label>Mobile No</label>
                <input defaultValue={user.user.phoneNumber || ""} id="phone" name="phone" type="number"/>
                
            </div>
            <div className={styles.infoContainer}>
                <label>Address</label>
                <input defaultValue={user.user.userAddress || ""} type="text" size="32" placeholder="" name="address" />
            </div>
        </div>
            <div className={styles.footer}>
                <button>Save</button>
            </div>
    </form>
    </div>

    <div className={styles.right}>
        <div className={styles.circularportrait}>
             <img src={imgSrc} />
        </div>
        <div className={styles.chooseImg}>
            <label for="files" class="btn">Change Image</label>
            <input onChange={fileHandler} id="files" style={{visibility:"hidden"}} type="file" accept="image/png, image/gif, image/jpeg"/>
        </div>
    </div>
    </div>

  )
}

export default Profile