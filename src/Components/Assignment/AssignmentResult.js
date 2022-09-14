import React, { useEffect, useState } from 'react'
import styles from './AssignmentResult.module.css'
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow,Paper } from '@mui/material';
import { saveAs } from "file-saver";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { toast } from 'react-toastify';


function AssignmentResult({closeResult,item}) {

    const [students,setStudents] = useState([])

    const saveFile = (e) => {
      saveAs(
        e.fileUrl,
        "example.pdf"
      );
    };

    useEffect(() => {
      axios.get("http://localhost:5000/api/getAssignmentResult/" + item.id,{withCredentials:true}).then((res)=>
      {
      setStudents(res.data.data)
      console.log(res.data.data)
      }).catch((err)=>{
      console.log(err);
      })
    
    }, [])

    const handleObtainedMarks = (index,value) =>
    {
      console.log(index,value)
      students[index].obtainedMarks = parseInt(value)
      console.log(students)
    }

    const handleResult = () =>
    {
      axios.post("http://localhost:5000/api/updateAssignmentResult",students,{withCredentials:true}).then((res)=>
      {
        if (res.status === 200) {
          toast.success('Result Updated', {position: toast.POSITION.TOP_RIGHT,});
          closeResult(false)
        }
      console.log(res)
      }).catch((err)=>{
      console.log(err);
      })
    }
    
  return (
    <>
    <div className={styles.modalBackground} onClick={() => closeResult(false)}></div>
    <div className={styles.modalContainer}>
      <div className={styles.students}>

      <TableContainer component={Paper}  >
        <Table sx={{ minWidth: 650 }} aria-label="simple table" color="#F7F6F2">

          <TableHead sx = {{backgroundColor:'#f5f5f5',color:'white'}}>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>File Url</TableCell>
              <TableCell>Obtained Marks</TableCell>
              <TableCell align='right'>Total Marks</TableCell>
              <TableCell>Submit Time</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
          {students.length === 0 &&  <TableRow >
            <TableCell colspan="7" style={{ "text-align": "center", }}>No Student Submitted Assignment yet</TableCell>
          </TableRow>}

            {students?.map((items,index) =>
            (
              <TableRow key={index}  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="left">{index+1}</TableCell>
                  <TableCell component="th" scope="row"><b>{items.fullName}</b></TableCell>
                  <TableCell component="th" scope="row">{items.email}</TableCell>
                  <TableCell component="th"><ArrowDownwardIcon onClick={() => saveFile(items)}/></TableCell>
                  <TableCell component="th">
                  <input
                type="number"
                id="quantity"
                name="quantity"
                style={{width:'40px'}}
                defaultValue= {items.obtainedMarks}
                onChange={(e) => handleObtainedMarks(index,e.target.value)}
                required
                min="1"
                max="1000"
              ></input>
                  </TableCell>
                  <TableCell component="th" align='right'>{item.totalMarks}</TableCell>
                  <TableCell component="th">{items.submittedTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
       
      </div>
      <button className={styles.button1} onClick={handleResult}>Update</button>
    </div>
      </>
  )
}

export default AssignmentResult