import { useState } from 'react';
import styles from './UploadModal.module.css'
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import {Storage} from './../Utils/firebase'
import {ref,uploadBytes,getDownloadURL,uploadBytesResumable} from "firebase/storage"
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';

function UploadModal({closeModal}) {

  const courseIdredux=useSelector(state => state.getCourseIdOnClick.getCourseIdOnClick);
  const [title, setTitle] = useState('');
  const [file , setfile] = useState('');
  const [fileURL , setfileURL] = useState('');
  const [fileName,setFileName] = useState('')
  const [fileExtension,setFileExtention] = useState('')


  function getTime() {
    var date = new Date()
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString();
    }
  
  let yourDate=getTime();
  yourDate=yourDate.toString().split("T");
  yourDate[1]=yourDate[1].toString().split(".")[0];
  yourDate=yourDate.toString().replaceAll(","," "); 


  const fileHandler= async (e)=>{
      setfile(e.target.files[0]);
      const last_dot = e.target.files[0].name.lastIndexOf('.')
      const ext = e.target.files[0].name.slice(last_dot + 1)
      const name = e.target.files[0].name.slice(0, last_dot)
      setFileExtention(ext)
      setFileName(name)

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

  function handle(e){
      e.preventDefault()

      if(fileURL === '')
      {
        toast.error('File is not uploaded', {position: toast.POSITION.TOP_RIGHT,});
      }
      else{
        axios.post('http://localhost:5000/api/courseContent', {
          courseId:courseIdredux,
          fileUrl:fileURL,
          fileName:fileName,
          fileType:fileExtension,
          createdTime:yourDate,
          title:title
        },{withCredentials : true})
        .then(function (response) {
          if (response.status === 200) {
            toast.success('Content Added', {position: toast.POSITION.TOP_RIGHT,});
            closeModal(false)
          }})
        .catch(function (error) {console.log(error);});
      }

  }

  return (
    <>
    <div className={styles.modalBackground} onClick={() => closeModal(false)}></div>
        <form className={styles.modalContainer} onSubmit={handle}>
          <div className={styles.borderInput}>
          <input required className={styles.input} type="file" onChange={fileHandler} accept=".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.txt,.pdf,.zip,.rar,.7zip"/>
          </div>
          <FormControl variant="standard"> 
             <InputLabel htmlFor="component-helper">Title</InputLabel>
              <Input
                id="component-helper"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
          </FormControl>
          <button className={styles.button1} type='submit'>Add</button>
        </form>
    </>
  )
}

export default UploadModal