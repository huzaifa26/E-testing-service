import React from 'react';
import styles from './ShowQuestion.module.css';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

function ShowQuestion(props) {
  // const handle = () => {
  //   console.log(props.i);
  // };

  console.log(props)

  return (
    <>
          <TableRow
              key={props.i}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="left">{props.i}</TableCell>
              <TableCell component="th" scope="row">{props.item.courseName}</TableCell>
              <TableCell component='th'>{props.item.questionType}</TableCell>
              <TableCell component='th'>{props.item.question}</TableCell>
              <TableCell component='th'>{'[ ' + props.item.options + ' ]'}</TableCell>
              <TableCell component='th' className={styles.correct}>{props.item.correctOption}</TableCell>
            </TableRow>
    </>
  );
}

export default ShowQuestion;
