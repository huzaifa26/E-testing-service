import React, { useState } from 'react';
import styles from './Showpool.module.css';
import { useSelector } from 'react-redux';
import ShowQuestion from './ShowQuestion';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const publishCourses = [
  {
    id: 1,
    name: 'Database',
  },
  {
    id: 3,
    name: 'Assembly language',
  },
];

function ShowPool() {
  const [courseId, setCourseId] = useState('0');

  const allQuestions = useSelector((state) => {
    return state.pools.allQuestions;
  });

  const handleShow = (e) => {
    setCourseId(e.target.value);
  };

  return (
    <div>
      <div className={styles.poolsMain}>
      <div className={styles.poolsCategory}>
        <label for="dog-names">Select Course &nbsp;&nbsp;&nbsp;&nbsp;:</label>
        <select onChange={handleShow}>
          <option value={0} selected>
            All Courses
          </option>
          {publishCourses.map((value) => {
            return <option value={value.id}>{value.name}</option>;
          })}
        </select>
      </div>
      </div>
      <div className={styles.table1}>
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650,height:'100%' }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell align="left"><b>Course Name  </b></TableCell>
            <TableCell align="left"><b>  Category</b></TableCell>
            <TableCell align="left"><b>  Question</b></TableCell>
            <TableCell align="left"><b>  Options</b></TableCell>
            <TableCell align="left"><b>  Correct Answer</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {courseId === '0'
              ? allQuestions.map((item, i) => {
                  i++;
                  return (
                    <ShowQuestion i={i} courseName={item.courseName} correctAnswer={item.correctAnswer} questionType={item.questionType} question={item.question} options={item.options}
                    />
                  );
                })
              : allQuestions
                  .filter((data) => data.courseId === courseId)
                  .map((item, i) => {
                    i++;
                    return (
                      <ShowQuestion
                        i={i}
                        item={item}
                      />
                    );
                  })}
        </TableBody>
      </Table>
    </TableContainer>
      </div>
    </div>
  );
}

export default ShowPool;
