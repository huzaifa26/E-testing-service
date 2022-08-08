import styles from './Content.module.css'
import { useSelector, useDispatch } from 'react-redux';
import UploadModal from './UploadModal';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import {courseContentActions} from './../../Redux/course-slice'
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';


function Content() {

  const courseIdredux=useSelector(state => state.getCourseIdOnClick.getCourseIdOnClick);
  // const publishCourses=useSelector(state=> {return state.courses});
  // const courseJoin=useSelector(state=> state.courseJoin);
  const dispatch=useDispatch();
  const courseContent = useSelector(state => state.courseContent.courseContent)
  console.log(courseContent);
  const [cookie,setCookie]=useCookies();
  const [openModal,setOpenModal] =useState(false)
  const user=useSelector(state=> state.user);


  const joinhandle=()=>{
    setOpenModal(true);
  }
  
  useEffect(()=>{
    if(user?.userInfo?.hasOwnProperty("user") === true){
      axios.get("http://localhost:5000/api/courseContent/"+courseIdredux,{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}
      ).then((res)=>{
        dispatch(courseContentActions.courseContent(res.data.data));
      }).catch((err)=>{
        console.log(err);
      })
    } 
},[openModal]);




  return (
    <div className={styles.Main}>
    {/* if user id matches with user id with this course in backend table courses only then show it */}
    <div className={styles.buttonHolder}><button className={styles.button1} onClick={joinhandle}>Upload Content</button></div>
    

    
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>TITLE</TableCell>
          <TableCell>FILETYPE</TableCell>
          <TableCell>TIME</TableCell>
          <TableCell>ACTIONS</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {courseContent.map((item) =>
        {
          return(
          <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.fileType}</TableCell>
              <TableCell>{item.createdTime}</TableCell>
              <TableCell><a href={item.fileUrl} download='untitled'>Download</a></TableCell>

          </TableRow>
          
        )})}
      </TableBody>
    </Table>


    {openModal && <UploadModal closeModal={setOpenModal}/>}
    </div>
  )
}

export default Content