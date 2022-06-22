import React from 'react'
import styles from './Modal.module.css'
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import {useSelector} from "react-redux";
import {useCookies} from "react-cookie";

function Modal({closeModal}) {
  const [cookie,setCookie]=useCookies();
  const user=useSelector(state=> state.user);


    const formik = useFormik({
      initialValues: {
        coursename: '',
        joiningkey: '',
        confirmjoiningkey: '',
      },
      validationSchema: Yup.object({
        coursename: Yup.string().required('Required'),
        joiningkey: Yup.string().required('Joining Key is required'),
        confirmjoiningkey: Yup.string().oneOf(
          [Yup.ref('joiningkey'), null],
          'Join key  must match'
        ),
      }),
      onSubmit: (values, { resetForm }) => {
        axios.post('http://localhost:5000/api/createCourse', {
            coursename: values.coursename,
            joiningkey: values.joiningkey,
          },{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}})
          .then(function (response) {})
          .catch(function (error) {});
      },
    });
  

  return (
    <>
    <div className={styles.modalBackground}></div>
        <form className={styles.modalContainer} onSubmit={(e) => {e.preventDefault();formik.handleSubmit();}}>
          <h1 className={styles.h1}>Create Course</h1>
          <div className={styles.fieldMain}>
            <div className={styles.field}>
            <input
              type="text"
              id="coursename"
              placeholder="Course Name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.coursename}
            />
            {formik.touched.coursename && formik.errors.coursename ? (
              <p>{formik.errors.coursename}</p>
            ) : null}
          </div>
          <div className={styles.field}>

            <input
              type="password"
              id="joiningkey"
              placeholder="Joining Key"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.joiningkey}
              />
            {formik.touched.joiningkey && formik.errors.joiningkey ? (
              <p>{formik.errors.joiningkey}</p>
              ) : null}
          </div>
          <div className={styles.field}>
            <input
              id="confirmjoiningkey"
              type="password"
              placeholder="Confirm Joining Key"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmjoiningkey}
            />
            {formik.touched.confirmjoiningkey && formik.errors.confirmjoiningkey ? (
              <p>{formik.errors.confirmjoiningkey}</p>
            ) : null}
          </div>
          </div>
            <div className={styles.footer}>
                <button onClick={() => closeModal(false)}>Cancel</button>
                <button type='submit'>Create </button>
            </div>
        </form>
        </>
  )
}

export default Modal