import React, { useState } from 'react'
import styles from './UploadAssignment.module.css'
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { Storage } from '../../Utils/firebase'
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';

function UploadAssignment({ closeUpload }) {

  const courseIdredux = useSelector(state => state.getCourseIdOnClick.getCourseIdOnClick);
  const [title, setTitle] = useState('');
  const [file, setfile] = useState('');
  const [fileURL, setfileURL] = useState('');
  const [fileName, setFileName] = useState('')
  const [fileExtension, setFileExtention] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [marks, setMarks] = useState('')



  const fileHandler = async (e) => {
    setfile(e.target.files[0]);
    const last_dot = e.target.files[0].name.lastIndexOf('.')
    const ext = e.target.files[0].name.slice(last_dot + 1)
    const name = e.target.files[0].name.slice(0, last_dot)
    setFileExtention(ext)
    setFileName(name)

    if (file == null)
      return;

    console.log(file);
    toast(0, { autoClose: false, toastId: 1 })

    try {
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
              autoClose: 1000
            });
          });
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  function handle(e) {
    e.preventDefault()
    if (fileURL === '') {
      toast.error('File is not uploaded', { position: toast.POSITION.TOP_RIGHT, });
    }
    else {

      // let data = {
      //   courseId:courseIdredux,
      //   fileUrl:fileURL,
      //   fileName:fileName,
      //   fileType:fileExtension,
      //   title:title,
      //   startTime:startTime,
      //   endTime:endTime,
      // }

      // console.log(startTime)

      axios.post('http://localhost:5000/api/uploadAssignment', {
        courseId: courseIdredux,
        fileUrl: fileURL,
        fileName: fileName,
        fileType: fileExtension,
        title: title,
        startTime: startTime,
        endTime: endTime,
        totalMarks: marks,
      }, { withCredentials: true })
        .then(function (response) {
          if (response.status === 200) {
            toast.success('Assignment Added', { position: toast.POSITION.TOP_RIGHT, });
            closeUpload(false)
          }
          console.log(response);
        })
        .catch(function (error) {
          console.log(error)
          toast.error('Unable to upload', { position: toast.POSITION.TOP_RIGHT, });
        });;
    }
  }


  return (
    <>
      <div className={styles.modalBackground} onClick={() => closeUpload(false)}></div>
      <form className={styles.modalContainer} onSubmit={handle}>
        <div className={styles.borderInput}>

          <input required className={styles.input} type="file" onChange={fileHandler} accept=".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.txt,.pdf,.zip,.rar,.7zip" />
        </div>
        <FormControl variant="standard" sx={{ margin: "0 3px" }}>
          <InputLabel htmlFor="component-helper">Title</InputLabel>
          <Input
            id="component-helper"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </FormControl>

        <Stack component="form" noValidate spacing={2}>
          <TextField
            id="datetime-local"
            label="Start Time"
            type="datetime-local"
            size='small'
            value={startTime}
            required
            onChange={(e) => setStartTime(e.target.value)}
            sx={{ width: "100%" }}
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
            required
            onChange={(e) => setEndTime(e.target.value)}
            sx={{ width: "100%" }}
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
            value={marks}
            onChange={(e) => {
              setMarks(e.target.value);
            }}
            required
            min="1"
            max="1000"
          ></input>
        </div>
        <button className={styles.button1} type='submit'>Add</button>
      </form>
    </>
  )
}

export default UploadAssignment