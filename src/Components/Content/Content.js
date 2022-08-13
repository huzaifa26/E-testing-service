import styles from './Content.module.css'
import { useSelector, useDispatch } from 'react-redux';
import UploadModal from './UploadModal';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import {courseContentActions} from './../../Redux/course-slice'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow,TablePagination,Paper } from '@mui/material';

function Content() {

  const [cookie,setCookie]=useCookies();
  const dispatch=useDispatch();
  const courseIdredux=useSelector(state => state.getCourseIdOnClick.getCourseIdOnClick);
  const courseContent = useSelector(state => state.courseContent.courseContent)
  const courseClickUserId = useSelector(state => state.courseClickUserId.courseClickUserId)
  const user=useSelector(state=> state.user);
  const [openModal,setOpenModal] =useState(false)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [showButton,setShowButton] = useState()

  // const publishCourses=useSelector(state=> {return state.courses});
  // const courseJoin=useSelector(state=> state.courseJoin);


  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  

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
    console.log(typeof(user.userInfo.user.id))
    console.log(typeof(courseClickUserId))
},[openModal]);



  return (
    <div className={styles.Main}>
    {/* if user id matches with user id with this course in backend table courses only then show it */}
    {user.userInfo.user.id == courseClickUserId &&   <div className={styles.buttonHolder}><button className={styles.button1} onClick={joinhandle}>Upload Content</button></div> }
  


    <Paper sx={{padding:3}}>
      <TableContainer component={Paper}  >
        <Table sx={{ minWidth: 650 }} aria-label="simple table" color="#F7F6F2">

          <TableHead sx= {{backgroundColor:'#C9CCD5'}}>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>TITLE</TableCell>
              <TableCell>FILETYPE</TableCell>
              <TableCell>TIME</TableCell>
              <TableCell>ACTIONS</TableCell>
            </TableRow>
          </TableHead>

          <TableBody >
            {courseContent.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) =>
            (
              <TableRow key={item.id}  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="left">{item.id}</TableCell>
                  <TableCell component="th" scope="row"><b>{item.title.toUpperCase()}</b></TableCell>
                  <TableCell component="th">{item.fileType}</TableCell>
                  <TableCell component="th">{item.createdTime}</TableCell>
                  <TableCell component="th"><a href={item.fileUrl} download='untitled'>Download</a></TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>
      <TablePagination
          rowsPerPageOptions={[7]}
          component="div"
          count={courseContent.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
    </Paper>

    {openModal && <UploadModal closeModal={setOpenModal}/>}
    </div>
  )
}

export default Content