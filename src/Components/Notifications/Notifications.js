import styles from './Notifications.module.css';
import React from 'react';
import Navbar from '../Navbar/Navbar';

function Notification() {
  return (
    <div className={styles.notification}>
      <Navbar />
      Notification
    </div>
  );
}

export default Notification;
