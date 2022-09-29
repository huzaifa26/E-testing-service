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

function Assignment() {

  
  const user=useSelector(state=> state.user);
  const courseClickUserId = useSelector(state => state.courseClickUserId.courseClickUserId)
  const courseIdredux=useSelector(state => state.getCourseIdOnClick.getCourseIdOnClick);
  const [cookie,setCookie]=useCookies();
  const [openUplodad,setOpenUplodad] =useState(false)
  const [openEdit,setOpenEdit] = useState(false)
  const [openSubmit,setOpenSubmit] = useState(false)
  const [openResult,setOpenResult] = useState(false)
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
  setOpenSubmit(true)
  setDetail(item)
}

const handleResult = (item) =>
{
  setOpenResult(true)
  setDetail(item)
} 

  return (
    <div className={styles.Main}>

      <div className={styles.heads}>

      <h1>Assignment</h1>      
        {user.userInfo.user.id == courseClickUserId &&   <div className={styles.buttonHolder}><button className={styles.button1} onClick={joinhandle}>
       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg"viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" /> </svg>{' '}
          Upload Assignment</button></div> }
          </div>

        <Paper sx={{padding:'3px',marginTop:'20px'}}>
      <TableContainer component={Paper}  >
        <Table sx={{ minWidth: 650 }} aria-label="simple table" color="#F7F6F2">

          <TableHead sx= {{backgroundColor:'#f5f5f5',color:'white'}}>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>File Type</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End time</TableCell>
              {user.userInfo.user.id !== courseClickUserId &&  <TableCell>Status</TableCell> }
              <TableCell align='right'>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody >
          

          {assignments.length === 0 &&  <TableRow >
            <TableCell colspan="7" style={{ "text-align": "center", }}>No Assignment Uploaded yet</TableCell>
          </TableRow>}

            {assignments?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item,index) =>
            (
              <TableRow key={item.id}  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="left">{index+1}</TableCell>
                  <TableCell component="th" scope="row"><b>{item.assignmentTitle}</b></TableCell>
                  <TableCell component="th">{item.fileType}</TableCell>
                  <TableCell component="th">{item.startTime}</TableCell>
                  <TableCell component="th">{item.endTime}</TableCell>
                  {user.userInfo.user.id !== courseClickUserId &&  <TableCell  component="th">Status</TableCell> }
                  <TableCell component="th" align='right'>
                    
                  {user.userInfo.user.id == courseClickUserId &&   <EditIcon style={{ color: '#2A84EB' }} onClick={() => handleEdit(item)}/> }
                  {user.userInfo.user.id == courseClickUserId &&   <DeleteIcon style={{ color: '#E53472' }} onClick={() =>{handleDelete(item)}}/> }
                  {user.userInfo.user.id == courseClickUserId &&   <ListAltIcon style={{ color: '#293462' }} onClick={() =>{handleResult(item)}}/> }

                  {user.userInfo.user.id !== courseClickUserId &&  <ArrowDownwardIcon onClick={() => saveFile(item)}/>}
                  {user.userInfo.user.id !== courseClickUserId &&  <UploadFileIcon onClick={() => handleSubmitAssignment(item) }/> }
                    
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
    </Paper>

    {openUplodad && < UploadAssignment closeUpload={setOpenUplodad}/>}
    {openEdit && <EditAssignment closeEdit={setOpenEdit} item={detail}/>}
    {openSubmit && <SubmitAssignment closeSubmit={setOpenSubmit} item={detail} />}
    {openResult && <AssignmentResult closeResult={setOpenResult} item={detail} />}

    </div>
  )
}

export default Assignment