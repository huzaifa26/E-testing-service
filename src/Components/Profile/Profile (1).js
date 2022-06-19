import React from 'react'
import styles from './Profile.module.css'

function Profile() {
  return (
    <div className={styles.main}>
        <div className={styles.leftTop}>
            
        <div className={styles.h1}>
                <h1>
                    P R O F I L E
                </h1>
        </div>

    <div className={styles.left}>
        <h1>Details</h1>
        <div className={styles.leftContainer}>
            <div className={styles.infoContainer}>
                <label>Name</label>
                <input type="text" size="32" placeholder="Huzaifa Abid" name="fee" />
            </div>
            <div className={styles.infoContainer}>
                <label>Email</label>
                <input type="text" size="32" placeholder="huzaifaabid@gmail.com" name="fee" />
            </div>
            <div className={styles.infoContainer}>
                <label>Mobile No</label>
                <input type="text" size="32" placeholder="" name="fee" />
            </div>
            <div className={styles.infoContainer}>
                <label>Address</label>
                <input type="text" size="32" placeholder="" name="fee" />
            </div>
        </div>
            <div className={styles.footer}>
                <button>Save</button>
            </div>
    </div>
    </div>

    <div className={styles.right}>

        <div class={styles.circularportrait}>
             <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiGIKcZUmak_gOeCSHHLjeRIfr0RUIWwCjEA&usqp=CAU" />
        </div>

    </div>
    </div>

  )
}

export default Profile