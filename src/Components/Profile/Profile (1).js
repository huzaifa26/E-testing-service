import React, { useState } from 'react'
import styles from './Profile.module.css'
import { useSelector } from 'react-redux';
import {Storage} from "../Utils/firebase";
import {ref,uploadBytes,getDownloadURL} from "firebase/storage"
import { useRef } from 'react';
import axios from 'axios';
import {ToastContainer, toast } from 'react-toastify';
import {useNavigate} from "react-router-dom"


function Profile() {    
    const navigate=useNavigate();
    const formRef=useRef();
    const useAuth = useSelector((state) => state.user.userInfo);
    const user=useSelector(state=>{return state.user;})
    console.log(useAuth.userImg);

    const [image , setImage] = useState('');
    const [imageURL , setImageURL] = useState('');

    const imageHandler= async (e)=>{
        setImage(e.target.files[0]);
        console.log(e.target.files);
        
        if(image == null)
            return;

        const storageRef = ref(Storage, `/courseImages/${e.target.files[0].name}`);
        const uploadTask = await uploadBytes(storageRef, e.target.files[0]);
        
        getDownloadURL(ref(Storage, `/courseImages/${e.target.files[0].name}`)).then((url) => {
            console.log(url);
            setImageURL(url);
        });
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

        if((updatedUser.fullName !== useAuth.user.fullName) || (updatedUser.userAddress !== useAuth.user.userAddress) || (updatedUser.phoneNumber !== useAuth.user.phoneNumber) || (updatedUser.userImg !== useAuth.user.userImg)){
            console.log("update")
        } else {
            console.log("same");
        }



    axios.post("http://localhost:5000/api/user",updatedUser,{headers: {
        'authorization': `Bearer ${user.userInfo.token}`,
        'Accept' : 'application/json',
        'Content-Type': 'application/json'
    }}).then((res)=>{
        console.log(res.status);
        if(res.status === 200){
            
            toast.success('User Updated Successfully', {
                position: toast.POSITION.TOP_RIGHT,
            });

            navigate("/dashboard");
        }
    }).catch((err)=>{
        if(err.status === 500){
            toast.error('Cannot register Course', {
                position: toast.POSITION.TOP_RIGHT,
            });
        } 
    })
    }

    let imgSrc="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOIgbiAwf6mBkjE6iVQuxHMAHMXlcYvkshKJ9Tx-bexaRCbpR7WJNs7t_qh3Z4I8qe8HQ&usqp=CAU";
    if (useAuth.userImg !== null){
        imgSrc=useAuth.user.userImg;
    } else if(imageURL === "" && useAuth.userImg === null){
        imgSrc="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOIgbiAwf6mBkjE6iVQuxHMAHMXlcYvkshKJ9Tx-bexaRCbpR7WJNs7t_qh3Z4I8qe8HQ&usqp=CAU";
    } 
    if(imageURL !== ""){
        imgSrc = imageURL;
    }


  return (
    <div className={styles.main}>
        <div className={styles.leftTop}>
            
        <div className={styles.h1}>
                <h1>
                    P R O F I L E
                </h1>
        </div>

    <form ref={formRef} onSubmit={editUserFormSubmitHanlder} className={styles.left}>
        <h1>Details</h1>
        <div className={styles.leftContainer}>
            <div className={styles.infoContainer}>
                <label>Name</label>
                <input type="text" size="32" defaultValue={useAuth.user.fullName} name="name" />
            </div>
            <div className={styles.infoContainer}>
                <label>Email</label>
                <input disabled type="text" size="32" value={useAuth.user.email} name="email" />
            </div>
            <div className={styles.infoContainer}>
                <label>Mobile No</label>
                <input defaultValue={useAuth.user.phoneNumber || ""} id="phone" name="phone" type="number"/>
                
            </div>
            <div className={styles.infoContainer}>
                <label>Address</label>
                <input defaultValue={useAuth.user.userAddress || ""} type="text" size="32" placeholder="" name="address" />
            </div>
        </div>
            <div className={styles.footer}>
                <button>Save</button>
            </div>
    </form>
    </div>

    <div className={styles.right}>
        <div class={styles.circularportrait}>
             <img src={imgSrc} />
        </div>
        <div className={styles.chooseImg}>
            <label for="files" class="btn">Change Image</label>
            <input onChange={imageHandler} id="files" style={{visibility:"hidden"}} type="file" accept="image/png, image/gif, image/jpeg"/>
        </div>
    </div>
        <ToastContainer autoClose={1000}/>
    </div>

  )
}

export default Profile