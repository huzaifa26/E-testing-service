import React, { useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Showpool.module.css';
import { useSelector } from 'react-redux';
import ShowQuestion from './ShowQuestion';
import Table from 'react-bootstrap/Table';

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
      <div className={styles.table}>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Course Name</th>
              <th>Category</th>
              <th>Question</th>
              <th>Options</th>
              <th>Correct Answer</th>
            </tr>
          </thead>
          <tbody>
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
                        courseName={item.courseName}
                        correctAnswer={item.correctAnswer}
                        questionType={item.questionType}
                        question={item.question}
                        options={item.options}
                      />
                    );
                  })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default ShowPool;
