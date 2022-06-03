import React from 'react';
import Navbar from '../Navbar/Navbar';
import styles from './Dashboard.module.css';

const joinedCourses =
[
  {id:2,
  name: 'Database'},
  {id:3,
  name: 'Assembly Language'},
  {id:2,
  name: 'Database'},
  {id:3,
  name: 'Assembly Language'},
  {id:2,
  name: 'Database'},
  {id:3,
  name: 'Assembly Language'},
  {id:2,
  name: 'Database'},
  {id:3,
  name: 'Assembly Language'},
  {id:2,
  name: 'Database'},
  {id:3,
  name: 'Assembly Language'},
  {id:2,
  name: 'Database'},
  {id:2,
  name: 'Database'},
  {id:2,
  name: 'Database'},
  
]

function Dashboard() {

  function joinhandle()
  {

  }

  return (
    <div className={styles.mainDashboard}>
    <div>
      <div className={styles.joinedHeader} >
      <h1>Joined Courses</h1>
      <button onClick={joinhandle}>Join Course</button>
      </div>
      <div className={styles.joinedCourses}>      
{joinedCourses.map((item) => {return( 
  <div className={styles.joinedList}>
  {item.name}</div>)})}     
      </div>
    </div>


    <div>
      <div className={styles.joinedHeader} >
      <h1>Published Courses</h1>
      <button>Create Course</button>
      </div>
      <div className={styles.joinedCourses}>      
{joinedCourses.map((item) => {return( 
  <div className={styles.joinedList}>
  {item.name}</div>)})}     
      </div>
  
    </div>
    </div>
  );
}

export default Dashboard;
