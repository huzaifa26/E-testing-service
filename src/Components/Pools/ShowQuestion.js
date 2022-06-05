import React from 'react';
import styles from './ShowQuestion.module.css';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

function ShowQuestion(props) {
  // const handle = () => {
  //   console.log(props.i);
  // };

  return (
    <>
          <TableRow
              key={props.i}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="right">{props.i}</TableCell>
              <TableCell component="th" scope="row">{props.courseName}</TableCell>
              <TableCell component='th'>{props.questionType}</TableCell>
              <TableCell component='th'>{props.question}</TableCell>
              <TableCell component='th'>{'[ ' + props.options + ' ]'}</TableCell>
              <TableCell component='th' className={styles.correct}>{props.correctAnswer}</TableCell>
            </TableRow>
    </>
  );
}

export default ShowQuestion;
