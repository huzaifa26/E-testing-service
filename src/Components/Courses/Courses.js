import React from 'react';
import styles from './Courses.module.css';
import {Editor} from 'draft-js';
import 'draft-js/dist/Draft.css';
import {useLocation} from "react-router-dom";
import { useSelector } from 'react-redux';

const Courses=(props) => {
  const location=useLocation();
  const courseIdredux=useSelector(state => state.getCourseIdOnClick.getCourseIdOnClick);

  return (
    <div className={styles.Main}>
      <div>
        <h1>Course </h1>
        <p>Course Name</p>
      </div>
    </div>
  );
}

export default Courses;