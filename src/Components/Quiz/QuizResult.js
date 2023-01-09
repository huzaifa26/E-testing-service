import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './QuizResult.module.css'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper } from '@mui/material';

function QuizResult() {
    const location = useLocation();
    const [quizResult, setQuizResult] = useState([])
    const [cookie, setCookie] = useCookies();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(7);
    const navigate = useNavigate()

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleAnswers = (answers, name, email) => {
        navigate("/courses/quiz/result/answers", { state: { data: answers, name: name, email: email } })

    };
    const handleLog = (log, name, email) => {
        navigate("/courses/quiz/result/log", { state: { data: log, name: name, email: email } })

    };


    useEffect(() => {
        axios.get("http://localhost:5000/api/getAllResult/" + location.state.previewDetails.id + '/' + location.state.previewDetails.courseId + "/" + location.state.previewDetails.totalPoints + '/' + location.state.previewDetails.questions.length, { withCredentials: true }, { headers: { Authorization: `Bearer ${cookie.token}` } }
        ).then((res) => {
            setQuizResult(res.data)
        }).catch((err) => {
            console.log(err);
        })
    }, [])

    return (
        <div className={styles.Main}>
            <h1 className={styles.h1}>{"Quiz Result" + " : " + location.state.previewDetails.quizTitle}</h1>
            <div className={styles.okok}>
                <div className={styles.headss}><p>Teacher</p></div>
                <TableContainer className={styles.container}  >
                    <Table className={styles.table} sx={{ minWidth: 1 }} aria-label="simple table" color="#F7F6F2">

                        <TableHead sx={{ color: 'white' }}>
                            <TableRow>
                                <TableCell className={styles.headTitle} ></TableCell>
                                <TableCell className={styles.headTitle} >Name</TableCell>
                                <TableCell className={styles.headTitle} >Email</TableCell>
                                <TableCell className={styles.headTitle} >Total Questions</TableCell>
                                <TableCell className={styles.headTitle} >Attempted Questions</TableCell>
                                <TableCell className={styles.headTitle} >Total Marks</TableCell>
                                <TableCell className={styles.headTitle} >Obtained Questions</TableCell>
                                <TableCell className={styles.headTitle} align="left" >Actions</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody >

                            {quizResult?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) =>
                            (
                                <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell className={styles.ind} align="left">{index + 1}</TableCell>
                                    <TableCell className={styles.ind} component="th" scope="row"><b>{item.fullName}</b></TableCell>
                                    <TableCell className={styles.ind} component="th">{item.email}</TableCell>
                                    <TableCell className={styles.ind} component="th">{item.totalQuestions}</TableCell>
                                    <TableCell className={styles.ind} component="th">{item.attemptedQuestions.length}</TableCell>
                                    <TableCell className={styles.ind} component="th">{item.totalMarks}</TableCell>
                                    <TableCell className={styles.ind} component="th">{item.obtainedMarks}</TableCell>
                                    <TableCell className={styles.ind} component="th" align='left'>
                                        {item.attemptedQuestions.length > 0 && <button variant="contained" className={styles.preview} onClick={() => handleAnswers(item.attemptedQuestions, item.fullName, item.email)} >Answers</button>}
                                        {item.log.length > 0 && <button variant="contained" className={styles.preview2} onClick={() => handleLog(item.log, item.fullName, item.email)} >Log</button>}
                                        {(!item.log.length > 0 && !item.attemptedQuestions.length > 0) && <p className='ml-[5px]'>Not Attempted</p>}

                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[7]}
                    component="div"
                    count={quizResult?.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div>


        </div >
    )
}

export default QuizResult