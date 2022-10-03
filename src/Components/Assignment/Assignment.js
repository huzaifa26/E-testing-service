import React, { useState } from 'react'
import styles from './Assignment.module.css'
import { useSelector} from 'react-redux';
import UploadAssignment from './UploadAssignment'
import { useCookies } from 'react-cookie';
import { useEffect} from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow,TablePagination,Paper } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import ListAltIcon from '@mui/icons-material/ListAlt';
import EditIcon from '@mui/icons-material/Edit';
import { saveAs } from "file-saver";
import EditAssignment from './EditAssignment';
import { toast } from 'react-toastify';
import SubmitAssignment from './SubmitAssignment';
import AssignmentResult from './AssignmentResult';
import { useNavigate } from 'react-router-dom';
import SubmitResult from './SubmitResult';

function Assignment() {

  const navigate = useNavigate()
  const user=useSelector(state=> state.user);
  const courseClickUserId = useSelector(state => state.courseClickUserId.courseClickUserId)
  const courseIdredux=useSelector(state => state.getCourseIdOnClick.getCourseIdOnClick);
  const [cookie,setCookie]=useCookies();
  const [openUplodad,setOpenUplodad] =useState(false)
  const [openEdit,setOpenEdit] = useState(false)
  const [openSubmit,setOpenSubmit] = useState(false)
  const [openResult,setOpenResult] = useState(false)
  const [openSubmitResult,setOpenSubmitResult] = useState(false)
  const [detail,setDetail] = useState({})
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [assignments,setAssignments] = useState([])
  //only to trigger useEffect when delete happens
  const [deleteme,setDelete] = useState(false)
  
const handleChangePage = (event, newPage) => {
  setPage(newPage);
};

const handleChangeRowsPerPage = (event) => {
  setRowsPerPage(+event.target.value);
  setPage(0);
};

const joinhandle=()=>{
  setOpenUplodad(true);
}

useEffect(()=>{
      console.log(courseIdredux)
      console.log('-------------------')
      axios.get("http://localhost:5000/api/getAssignments/"+courseIdredux,{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}
      ).then((res)=>{
        setAssignments(res.data.data)
      }).catch((err)=>{
        console.log(err);
      })
},[openUplodad,openEdit,deleteme]);

const handleEdit = (item) =>
{
 setOpenEdit(true)
 setDetail(item)
}

const saveFile = (e) => {
  saveAs(
    e.fileUrl,
    "example.pdf"
  );
};

const handleDelete = (e) =>
{
  setDelete((state) => !state)
    axios.get("http://localhost:5000/api/deleteAssignment/"+e.id,{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}
    ).then((res)=>{
      if (res.status === 200) {
        toast.success('Deleted', {position: toast.POSITION.TOP_RIGHT,});
      }
    }).catch((err)=>{
      console.log(err);
    })
}

const handleSubmitAssignment = (item) =>
{
  setDetail(item)
  setOpenSubmit(true)
}

const handleSubmitResult = (item) =>
{
  setOpenSubmitResult(true)
  setDetail(item)
}

const handleResult = (item) =>
{
  setDetail(item)
  setOpenResult(true)
} 

  return (
    <div className={styles.Main}>

      <div className={styles.heads}>

      <h1>Assignment</h1>      
        {user.userInfo.user.id == courseClickUserId &&   <div className={styles.buttonHolder}><button className={styles.button1} onClick={joinhandle}>
       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg"viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" /> </svg>{' '}
          Upload Assignment</button></div> }
          </div>

        <div className={styles.okok}>
      <div className={styles.headss}><p>{user.userInfo.user.id == courseClickUserId ? "Teacher" : "Student"}</p></div>
      <TableContainer   >
        <Table sx={{ minWidth: 650}} aria-label="simple table" color="#F7F6F2">

      
          <TableHead sx= {{color:'white'}}>
            <TableRow >
              <TableCell className={styles.headTitle} ></TableCell>
              <TableCell className={styles.headTitle} >Title</TableCell>
              <TableCell className={styles.headTitle} >File Type</TableCell>
              <TableCell className={styles.headTitle} >Start Time</TableCell>
              <TableCell className={styles.headTitle} >End time</TableCell>
              {user.userInfo.user.id !== courseClickUserId &&  <TableCell className={styles.headTitle} >Status</TableCell> }
              <TableCell align='left' className={styles.headTitle} >Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody >
          

          {assignments.length === 0 &&  <TableRow >
            <TableCell colspan="7" style={{ "text-align": "center", }}>No Assignment Uploaded yet</TableCell>
          </TableRow>}

            {assignments?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item,index) =>
            (
              <TableRow key={item.id}  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell className={styles.ind} align="left">{index+1}</TableCell>
                  <TableCell className={styles.ind}component="th" scope="row"><b>{item.assignmentTitle}</b></TableCell>
                  <TableCell className={styles.ind}component="th">{item.fileType}</TableCell>
                  <TableCell className={styles.ind} component="th">{item.startTime}</TableCell>
                  <TableCell  className={styles.ind} component="th">{item.endTime}</TableCell>
                  {user.userInfo.user.id !== courseClickUserId &&  <TableCell  component="th" className={styles.ind}>Not Submitted</TableCell> }
                  <TableCell component="th" align='left'>
                    
                  {user.userInfo.user.id == courseClickUserId &&   <EditIcon style={{ color: '#2A84EB' }} onClick={() => handleEdit(item)}/> }
                  {user.userInfo.user.id == courseClickUserId &&   <DeleteIcon style={{ color: '#E53472' }} onClick={() =>{handleDelete(item)}}/> }
                  {user.userInfo.user.id == courseClickUserId &&   <ListAltIcon style={{ color: '#293462' }} onClick={() =>{handleResult(item)}}/> }

                  {user.userInfo.user.id !== courseClickUserId &&  <ArrowDownwardIcon style={{ color: '#E53472' }}  onClick={() => saveFile(item)}/>}
                  {user.userInfo.user.id !== courseClickUserId &&  <UploadFileIcon style={{ color: '#2A84EB' }} onClick={() => handleSubmitAssignment(item) }/> }
                  {user.userInfo.user.id !== courseClickUserId &&  <ListAltIcon style={{ color: '#2A84EB' }} onClick={() => handleSubmitResult(item) }/> }
                    
                  </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>
      <TablePagination
          rowsPerPageOptions={[7]}
          component="div"
          count={assignments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
    </div>

    {openUplodad && < UploadAssignment closeUpload={setOpenUplodad}/>}
    {openEdit && <EditAssignment closeEdit={setOpenEdit} item={detail}/>}
    {openSubmit && <SubmitAssignment closeSubmit={setOpenSubmit} item={detail} />}
    {openResult && <AssignmentResult closeResult={setOpenResult} item={detail} />}
    {openSubmitResult && <SubmitResult closeStudentResult={setOpenSubmitResult} item={detail} />}
    

    </div>
  )
}

export default Assignment