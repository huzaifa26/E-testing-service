import styles from './Content.module.css'
import { useSelector } from 'react-redux';
import UploadModal from './UploadModal';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import {courseContentActions} from './../../Redux/course-slice'
import { saveAs } from "file-saver";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow,TablePagination,Paper } from '@mui/material';

function Content() {

  const user=useSelector(state=> state.user);
  const courseClickUserId = useSelector(state => state.courseClickUserId.courseClickUserId)
  const courseIdredux=useSelector(state => state.getCourseIdOnClick.getCourseIdOnClick);
  const [cookie,setCookie]=useCookies();
  const [courseContent,setCourseContent] = useState([])
  const [openModal,setOpenModal] =useState(false)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);


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
      console.log(courseIdredux)
      axios.get("http://localhost:5000/api/courseContent/"+courseIdredux,{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}
      ).then((res)=>{
        setCourseContent(res.data.data);
        console.log(res.data.data)
      }).catch((err)=>{
        console.log(err);
      })

},[openModal]);

const saveFile = (e) => {
  saveAs(
    e.fileUrl,
    "example.pdf"
  );
};


  return (
    <div className={styles.Main}>
      <div className={styles.heads}>

      <h1>Content</h1>
    {/* if user id matches with user id with this course in backend table courses only then show it */}
    {user.userInfo.user.id === courseClickUserId &&   <div className={styles.buttonHolder}><button className={styles.button1} onClick={joinhandle}>Upload Content</button></div> }
      </div>
  
      <div className={styles.okok}>
      <div className={styles.headss}><p>{user.userInfo.user.id == courseClickUserId ? "Teacher" : "Student"}</p></div>
      <TableContainer className={styles.container}  >
        <Table className={styles.table} sx={{ minWidth: 1 }}  aria-label="simple table" color="#F7F6F2">

          <TableHead sx= {{color:'white'}}>
            <TableRow>
              <TableCell className={styles.headTitle} ></TableCell>
              <TableCell className={styles.headTitle} >Title</TableCell>
              <TableCell className={styles.headTitle} >File Type</TableCell>
              <TableCell className={styles.headTitle} >Time</TableCell>
              <TableCell  className={styles.headTitle} >Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody >
            
          {courseContent.length === 0 &&  <TableRow >
            <TableCell colspan="7" style={{ "text-align": "center", }}>No Content Uploaded yet</TableCell>
          </TableRow>}

            {courseContent.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item,index) =>
            (
              <TableRow key={item.id}  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell  className={styles.ind}  align="left">{index+1}</TableCell>
                  <TableCell className={styles.ind}  component="th" scope="row"><b>{item.title.toUpperCase()}</b></TableCell>
                  <TableCell className={styles.ind}  component="th">{item.fileType}</TableCell>
                  <TableCell  className={styles.ind} component="th">{item.createdTime}</TableCell>
                  <TableCell  className={styles.ind} component="th" align='left'><p className={styles.ind2} onClick={() => saveFile(item)}>Download</p></TableCell>
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
    </div>

    {openModal && <UploadModal closeModal={setOpenModal}/>}
    </div>
  )
}

export default Content