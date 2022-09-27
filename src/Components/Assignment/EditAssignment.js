import React, { useEffect, useState } from 'react'
import styles from './EditAssignment.module.css'
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import {Storage} from './../Utils/firebase'
import {ref,uploadBytes,getDownloadURL} from 'firebase/storage'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';


function EditAssignment({closeEdit,item}) {

    const courseIdredux=useSelector(state => state.getCourseIdOnClick.getCourseIdOnClick);
    const [title, setTitle] = useState(item.assignmentTitle);
    const [file , setfile] = useState('');
    const [fileURL , setfileURL] = useState(item.fileUrl);
    const [fileName,setFileName] = useState(item.fileName)
    const [fileExtension,setFileExtention] = useState(item.fileType)
    const [startTime,setStartTime] = useState(item.startTime)
    const [endTime,setEndTime] = useState(item.endTime) 
    const [marks,setMarks] = useState(item.totalMarks) 

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
            setfileURL(url);
        });
    }

function handle(e)
{
    e.preventDefault()

//     if(fileURL === item.fileUrl && item.fileName === fileName && item.startTime === startTime && item.endTime === endTime )
//     {
//         toast.warning('Please update atleast one field', {position: toast.POSITION.TOP_RIGHT,});
//     }
// else
// {

    axios.post('http://localhost:5000/api/editAssignment', {
      id:item.id,
      courseId:courseIdredux,
      fileUrl:fileURL,
      fileName:fileName,
      fileType:fileExtension,
      title:title,
      startTime:startTime,
      endTime:endTime,
      totalMarks:marks,
    },{withCredentials : true})
    .then(function (response) {
      if (response.status === 200) {
        toast.success('Assignment Updated', {position: toast.POSITION.TOP_RIGHT,});
        closeEdit(false)
      }
      })
    .catch(function (error) {
        console.log(error)
        toast.error('Unable to upload', {position: toast.POSITION.TOP_RIGHT,});
      });;

    // }
}
    

  return (
    <>
    <div className={styles.modalBackground} onClick={() => closeEdit(false)}></div>
    <form className={styles.modalContainer}>
    <div className={styles.borderInput}>
        <p>{fileName}</p>
        <label for="files" class={styles.label}>Change File</label>
          <input required  id="files"className={styles.input} type="file" onChange={fileHandler} accept=".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.txt,.pdf,.zip,.rar,.7zip"/>
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
          <Stack spacing={2}>
              <TextField
                id="datetime-local"
                label="Start Time"
                type="datetime-local"
                size='small'
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                // defaultValue="2022-09-14T17:56"
                sx={{ width: "100%"}}
                InputLabelProps={{
                  shrink: true,
                }}
                />

              <TextField
              id="datetime-local"
              label="End Time"
              size='small'
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              sx={{ width: "100%"}}
              InputLabelProps={{
                shrink: true,
              }}
            />
            </Stack>
            <div className={styles.Options}>
              <p>Total Marks :</p>
              <input
                type="number"
                id="quantity"
                className={styles.input1}
                name="quantity"
                value= {marks}
                onChange={(e) => {
                  setMarks(e.target.value);
                }}
                required
                min="1"
                max="1000"
              ></input>
            </div>
          <button className={styles.button1} onClick={handle}>Update</button>
    </form>
    </>
  )
}

export default EditAssignment