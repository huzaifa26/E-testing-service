import { useState } from 'react';
import styles from './UploadModal.module.css'
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import {Storage} from './../Utils/firebase'
import {ref,uploadBytes,getDownloadURL} from 'firebase/storage'
import { useSelector } from 'react-redux';
import axios from 'axios';



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

      const storageRef = ref(Storage, `/courseImages/${e.target.files[0].name}`);
      const uploadTask = await uploadBytes(storageRef, e.target.files[0]);
      
      getDownloadURL(ref(Storage, `/courseImages/${e.target.files[0].name}`)).then((url) => {
          console.log(url);
          setfileURL(url);
      });
  }

  function handle(e)
  {
      e.preventDefault()
      console.log(title,fileURL)
      console.log(fileExtension +"    and herre is name     " + fileName) 

      axios.post('http://localhost:5000/api/courseContent', {
        courseId:courseIdredux,
        fileUrl:fileURL,
        fileName:fileName,
        fileType:fileExtension,
        createdTime:yourDate,
        title:title
      },{withCredentials : true})
      .then(function (response) {console.log(response);})
      .catch(function (error) {console.log(error);});
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