import React from 'react'
import styles from './Modal.module.css'
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { useCookies } from "react-cookie";
import { useSelector, useDispatch } from 'react-redux';
import TextField from '@mui/material/TextField';



function getTime() {
  var date = new Date()
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString();
}

let yourDate = getTime();
yourDate = yourDate.toString().split("T");
yourDate[1] = yourDate[1].toString().split(".")[0];
yourDate = yourDate.toString().replaceAll(",", " ");

function Modal({ closeModal }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const [cookie] = useCookies();

  const formik = useFormik({
    initialValues: {
      joiningkey: '',
    },
    validationSchema: Yup.object({
      joiningkey: Yup.string().required('Joining Key is required'),
    }),
    onSubmit: (values, { resetForm }) => {
      let data = {
        userId: user.userInfo.user.id,
        joiningkey: values.joiningkey,
        joinTime: yourDate
      }

      console.log(data)
      axios.post('http://localhost:5000/api/joinCourse', data, { withCredentials: true }, { headers: { Authorization: `Bearer ${cookie.token}` } })
        .then(function (response) {
          if (response.status === 200) {
            closeModal(false)
          }
          if (response?.response?.status === 400) {
            toast.error('Wrong Key', {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
          if (response?.response?.status === 401) {
            toast.error('You have already joined this class', {
              position: toast.POSITION.TOP_RIGHT,
            });
          }

        })
        .catch(function (error) {
          console.log(error)
        });
    },
  });


  return (
    <>
      <div className={styles.modalBackground} onClick={() => closeModal(true)}></div>
      <form className={styles.modalContainer} onSubmit={(e) => { e.preventDefault(); formik.handleSubmit(); }}>
        <h1 className={styles.h1}>Join Class</h1>
        <div className={styles.fieldMain}>

          <div className={styles.field}>
            <TextField label="Class Key" variant="outlined" sx={{ width: '250px', marginBottom: '10px' }} size="medium"


              type="text"
              id="joiningkey"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.joiningkey}
            />
            {formik.touched.joiningkey && formik.errors.joiningkey ? (
              <p>{formik.errors.joiningkey}</p>
            ) : null}
          </div>

        </div>
        <div className={styles.footer}>
          <button type='submit'>Join</button>
        </div>
      </form>
    </>
  )
}

export default Modal