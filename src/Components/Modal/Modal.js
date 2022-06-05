import React from 'react'
import styles from './Modal.module.css'

function Modal({closeModal}) {
  return (
    <div className={styles.modalBackground}>
        <div className={styles.modalContainer}>

            <div className={styles.body}>
                <input type='text' placeholder='CourseName'></input>
                <input type='text' placeholder='CourseId'></input>
            </div>
            <div className={styles.footer}>
                <button onClick={() => closeModal(false)}>Cancel</button>
                <button>Create </button>
            </div>
        </div>
    </div>
  )
}

export default Modal