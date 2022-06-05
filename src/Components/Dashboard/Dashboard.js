import React, { useState } from 'react';
import Modal from '../Modal/Modal';
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
  const [openModal,setOpenModal] =useState(false)

  function joinhandle()
  {
    setOpenModal(true)

  }

  return (
    <div className={openModal ?  styles.mainDashboard1:styles.mainDashboard}>
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
      {openModal && <Modal closeModal={setOpenModal}/>}
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
