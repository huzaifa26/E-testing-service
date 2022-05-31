import React from 'react';
import styles from './ShowQuestion.module.css';

function ShowQuestion(props) {
  // const handle = () => {
  //   console.log(props.i);
  // };

  return (
    <>
      <tr>
        <td>{props.courseName}</td>
        <td>{props.questionType}</td>
        <td>
          <b>{props.question}</b>
        </td>
        <td>{'[ ' + props.options + ' ]'}</td>
        <td className={styles.correct}>{props.correctAnswer}</td>
        {/* <td>
          <div className={styles.myButtton} onClick={handle}>
            Delete
          </div>
        </td> */}
      </tr>
    </>
  );
}

export default ShowQuestion;
