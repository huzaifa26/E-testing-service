import React from 'react';
import Navbar from '../Navbar/Navbar';
import styles from './Dashboard.module.css';

function Dashboard() {
  return (
    <div className={styles.MainDashboard}>
      <Navbar />
      Dashboard
    </div>
  );
}

export default Dashboard;
