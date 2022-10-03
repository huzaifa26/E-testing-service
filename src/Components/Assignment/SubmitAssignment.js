import React,{useState} from 'react'
import styles from './SubmitAssignment.module.css'
import {Storage} from './../Utils/firebase'
import {ref,uploadBytes,getDownloadURL,uploadBytesResumable} from 'firebase/storage'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';

function SubmitAssignment({closeSubmit,item}) {

    const [file , setfile] = useState('');
    const [fileURL , setfileURL] = useState('');
     const user=useSelector(state=> state.user);



     const fileHandler= async (e)=>{
      setfile(e.target.files[0]);
      const last_dot = e.target.files[0].name.lastIndexOf('.')
      const ext = e.target.files[0].name.slice(last_dot + 1)
      const name = e.target.files[0].name.slice(0, last_dot)
  
      if(file == null)
          return;
  
      console.log(file);
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
            setfileURL(url);
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
function getTime() {
    var date = new Date()
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString();
}

      
const handle = (e) =>
{

    e.preventDefault()
    if(fileURL === '')
      {
        toast.error('File is not uploaded', {position: toast.POSITION.TOP_RIGHT,});
      }
    else
    {

    let currentTime=getTime();
    currentTime=currentTime.toString().split("T");
    currentTime[1]=currentTime[1].toString().split(".")[0];
    currentTime=currentTime.toString().replaceAll(","," "); 

    let data = {
      assignmentId:item.id,
      userId:user.userInfo.user.id,
      submittedTime:currentTime,
      fileUrl:fileURL,
    }

    console.log(data)
    axios.post('http://localhost:5000/api/submitAssignment',data,{withCredentials : true})
    .then(function (response) {
      if (response.status === 200) {
        toast.success('Assignment Submitted', {position: toast.POSITION.TOP_RIGHT,});
        closeSubmit(false)
      }
      console.log(response);})
    .catch(function (error) {
        console.log(error)
        toast.error('Unable to submit', {position: toast.POSITION.TOP_RIGHT,});
      })
    }
}

console.log(item)
  return (
    <>
    <div className={styles.modalBackground} onClick={() => closeSubmit(false)}></div>
    <form className={styles.modalContainer} onSubmit={handle}>
        <div className={styles.borderInput}>
            <input required className={styles.input} type="file" onChange={fileHandler} accept=".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.txt,.pdf,.zip,.rar,.7zip"/>
        </div>
    <button className={styles.button1} type='submit'>Submit</button>
    </form>
    </>
  )
}

export default SubmitAssignment