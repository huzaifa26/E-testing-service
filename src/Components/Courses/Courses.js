import React from 'react';
import Navbar from '../Navbar/Navbar';
import styles from './Module.Courses.css';

function Courses() {
  return (
    <div>
      <div className="courseMain">
        Courses
        <div className={styles.joinedCourses}></div>
        <div className={styles.publishedCourses}></div>
      </div>
    </div>
  );
}

export default Courses;
