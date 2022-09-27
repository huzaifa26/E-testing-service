import DisplayQuiz from './DisplayQuiz';
import React, {useCallback, useEffect,  useState } from 'react';
import Preview from './Preview';
import axios from 'axios';
import styles from './QuizTable.module.css'
import { Button,TableCell,TableRow} from '@mui/material';
import { toast } from 'react-toastify';
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";


function QuizTable(props) {

const [cookie]=useCookies();
const [quizQuestions,setQuizQuestions]=useState([]);
const [previewDetail,setPreviewDetail] = useState({})
const [quizQuestionsModal,setQuizQuestionsModal] = useState(false)
const [preview,setPreview] = useState(false)
const navigate = useNavigate();
const [quizData,setQuizData] = useState([])
  
const handlePreview = (item) =>
{
  setPreview(true)
  setPreviewDetail(item)
}

const handleEdit = (item) =>
{
  navigate("/courses/editQuiz", { state: {previewDetails:item}});
}

const handleDelete = (item) =>
{
  let data = {id:item.id}

  let url= "http://localhost:5000/api/quizDelete/";
  axios.post(url,data,{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}).then((res)=>{
    // setTriggerDelete((state) => !state)
    if (res.status === 200) {
      toast.success('Deleted', {position: toast.POSITION.TOP_RIGHT,});
    }
  }).catch((err)=>{
    console.log(err);
  })
}

const handleStartQuiz = (item) =>
{
  console.log(item)
  setQuizData(item)
  setQuizQuestionsModal(true)
}

const hidePreviewComponent=()=>{
    setPreview(false)
}

{if(props.student === false)
  return (
    <div>
    <TableRow key={props.id}  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell align="left">{props.id}</TableCell>
        <TableCell component="th" scope="row"><b>{props.quizTitle}</b></TableCell>
        <TableCell component="th">{props.startTime}</TableCell>
        <TableCell component="th">{props.endTime}</TableCell>
        <TableCell component="th" align='center'>
        <button className={styles.preview} onClick={() => handlePreview(props.data)}>Preview</button>
        <button className={styles.edit} onClick={() =>handleEdit(props.data)}>Edit</button>
        <button className={styles.button0} onClick={() => handleDelete(props.data)}>Delete</button>
        {/* <Button variant="contained" disabled={false} onClick={() =>handleStartQuiz(item)}>Start</Button> */}
        </TableCell>
    </TableRow>
    {preview && <Preview data={previewDetail} handlePreviewStart={hidePreviewComponent}/>}
    </div>
)}
  
  {if(props.student === true)
    return (
    <div>

    <TableRow key={props.id}  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell align="left">{props.id}</TableCell>
        <TableCell component="th" scope="row"><b>{props.quizTitle}</b></TableCell>
        <TableCell component="th">{props.startTime}</TableCell>
        <TableCell component="th">{props.endTime}</TableCell>
        <TableCell component="th" align='center'>
        <Button variant="contained" disabled={false} onClick={() =>handleStartQuiz(props.data)}>Start</Button>
        </TableCell>
    </TableRow>

    {quizQuestionsModal && <DisplayQuiz data={quizData} handleStartQuiz={setQuizQuestionsModal}/>}
    </div>
 )}
 
}

export default QuizTable