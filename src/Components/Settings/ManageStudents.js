import React from 'react'
import styles from './ManageStudents.module.css'
import { useState,useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Paper,TableContainer, TablePagination, Button,Table, TableBody, TableCell, TableHead, TableRow} from '@mui/material';




function ManageStudents() {
  const courseIdredux=useSelector(state => state.getCourseIdOnClick.getCourseIdOnClick);
  const [cookie,setCookie]=useCookies();
  const [manageUsers,setManageUsers]= useState([])
  const [detail,setDetail] = useState({})
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  //only to trigger useEffect when delete happens
  const [deleteme,setDelete] = useState(false)
  const [block,setBlock] = useState(false)
  const [unblock,setUnblock] = useState(false)
  
const handleChangePage = (event, newPage) => {
  setPage(newPage);
};

const handleChangeRowsPerPage = (event) => {
  setRowsPerPage(+event.target.value);
  setPage(0);
};

  const handleDelete = (item) =>
  {
    let data = {
      id:item.id,
      courseId:courseIdredux,
    }
    axios.post("http://localhost:5000/api/deleteUserFromCourse",data,{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}
    ).then((res)=>{
      setDelete((state) => !state )
      toast.success('Student Removed', {position: toast.POSITION.TOP_RIGHT,});
    }).catch((err)=>{
        console.log(err);
    })
  }

  const handleBlock = (item) =>
  {
    let data = {
      id:item.id,
      courseId:courseIdredux,
    }
    axios.post("http://localhost:5000/api/blockUserFromCourse",data,{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}
    ).then((res)=>{
      setBlock((state) => !state)
      toast.warn('Student Blocked', {position: toast.POSITION.TOP_RIGHT,});
    }).catch((err)=>{
        console.log(err);
    })
  }
  const handleUnblock = (item) =>
  {
    let data = {
      id:item.id,
      courseId:courseIdredux,
    }
    axios.post("http://localhost:5000/api/unblockUserFromCourse",data,{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}
    ).then((res)=>{
      setUnblock((state) => !state)
      toast.success('Student Unblocked', {position: toast.POSITION.TOP_RIGHT,});
    }).catch((err)=>{
        console.log(err);
    })
  }

  useEffect(() => {
    axios.post("http://localhost:5000/api/manageUsers",{courseIdredux},{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}
    ).then((res)=>{
      console.log(res)
      setManageUsers(res.data.data)
    }).catch((err)=>{
        console.log(err);
    })
}, [deleteme,block,unblock])

  return (
    <div className={styles.Main}>
      <div className={styles.okok}>
      <div className={styles.headss}><p>Students</p></div>
      <TableContainer   >
        <Table sx={{ minWidth: 5 }} aria-label="simple table" color="#F7F6F2">

          <TableHead sx= {{color:'white'}}>
            <TableRow>
              <TableCell className={styles.headTitle}>#</TableCell>
              <TableCell className={styles.headTitle}>Name</TableCell>
              <TableCell className={styles.headTitle}>Email</TableCell>
              <TableCell className={styles.headTitle}>Status</TableCell>
              {/* {user.userInfo.user.id !== courseClickUserId &&  <TableCell>Status</TableCell> } */}
              <TableCell align='center' className={styles.headTitle2}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody >
            {manageUsers?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item,index) =>
            (
              <TableRow key={item.id}  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="left"  className={styles.ind}>{index+1}</TableCell>
                  <TableCell component="th" scope="row"  className={styles.ind}><b>{item.fullName}</b></TableCell>
                  <TableCell component="th"  className={styles.ind}>{item.email}</TableCell>
                  <TableCell component="th"  className={styles.ind}>{item.blocked === 0 ? "Not Blocked":"Blocked"}</TableCell>
                  {/* {user.userInfo.user.id !== courseClickUserId &&  <TableCell  component="th">Status</TableCell> } */}
                  <TableCell component="th" align='center' >
                    <div className={styles.buttonHolder}>

                    
                  {item.blocked === 1 && <button className={styles.unblock}  onClick={() => handleUnblock(item)} >Unblock</button>}
                  {item.blocked === 0 && <button className={styles.block} onClick={() => handleBlock(item)}>Block</button>}
                  <button className={styles.delete} onClick={() => handleDelete(item)}>Remove</button>
                    </div>
                    
                  </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>
      <TablePagination
          rowsPerPageOptions={[7]}
          component="div"
          count={manageUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
    </div>
        
    </div>
  )
}

export default ManageStudents