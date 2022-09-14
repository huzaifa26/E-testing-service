import styles from './Content.module.css'
import { useSelector, useDispatch } from 'react-redux';
import UploadModal from './UploadModal';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import {courseContentActions} from './../../Redux/course-slice'
import { saveAs } from "file-saver";
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
      console.log(courseIdredux)
      axios.get("http://localhost:5000/api/courseContent/"+courseIdredux,{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}
      ).then((res)=>{
        dispatch(courseContentActions.courseContent(res.data.data));
        console.log(res.data.data)
      }).catch((err)=>{
        console.log(err);
      })
    }

},[openModal]);

const saveFile = (e) => {
  saveAs(
    e.fileUrl,
    "example.pdf"
  );
};


  return (
    <div className={styles.Main}>
    {/* if user id matches with user id with this course in backend table courses only then show it */}
    {user.userInfo.user.id == courseClickUserId &&   <div className={styles.buttonHolder}><button className={styles.button1} onClick={joinhandle}>Upload Content</button></div> }
  
    <Paper sx={{padding:'3px',marginTop:'20px'}}>
      <TableContainer component={Paper}  >
        <Table sx={{ minWidth: 650 }} aria-label="simple table" color="#F7F6F2">

          <TableHead sx= {{backgroundColor:'#f5f5f5',color:'white'}}>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>File Type</TableCell>
              <TableCell>Time</TableCell>
              <TableCell  align='center'>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody >
            
          {courseContent.length === 0 &&  <TableRow >
            <TableCell colspan="7" style={{ "text-align": "center", }}>No Content Uploaded yet</TableCell>
          </TableRow>}

            {courseContent.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) =>
            (
              <TableRow key={item.id}  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="left">{item.id}</TableCell>
                  <TableCell component="th" scope="row"><b>{item.title.toUpperCase()}</b></TableCell>
                  <TableCell component="th">{item.fileType}</TableCell>
                  <TableCell component="th">{item.createdTime}</TableCell>
                  <TableCell component="th" align='center'><button className={styles.download} onClick={() => saveFile(item)}>Download</button></TableCell>
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