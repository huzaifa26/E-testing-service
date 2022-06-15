import React from 'react';
import styles from './ForgotPassword.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import image from './../../Assets/logo.png';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ForgotPassword() {

  let { id } = useParams();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmpassword: '',
    },
    validationSchema: Yup.object({
      password: Yup.string().required('Password is required'),
      confirmpassword: Yup.string().oneOf(
        [Yup.ref('password'), null],
        'Passwords must match'
      ),
    }),
       onSubmit: (values, { resetForm }) => {
       const newPassword = values.password
      axios
      .post('http://localhost:5000/api/forgotPasswordChange', { id,newPassword})
      .then(function (response) {
        if (response.status === 200) {
          toast.success('Password Changed', {
            position: toast.POSITION.TOP_RIGHT,
          });
          //run this after 5.7 seconds.
          setTimeout(function () {
            navigate('/');
          }, 5700); 
        }
      })
      .catch(function (error) {
        console.log(error)
        toast.error('Something Wrong Happend', {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
    },
  });

  return (
    <div className={styles.SignupMain}>
      <div className={styles.SignupImage}>
        <img src={image} alt="logo"></img>
      </div>
      <div className={styles.SignupContainer}>
        <form
          className={styles.SignupForm}
          onSubmit={(e) => {
            e.preventDefault();
            formik.handleSubmit();
          }}
        >
          <h1 className={styles.SignupName}>Change Password</h1>
          <div className={styles.field}>
            <input
              type="password"
              id="password"
              placeholder="New Password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password ? (
              <p>{formik.errors.password}</p>
            ) : null}
          </div>
          <div className={styles.field}>
            <input
              id="confirmpassword"
              type="password"
              placeholder="Confirm Password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmpassword}
            />
            {formik.touched.confirmpassword && formik.errors.confirmpassword ? (
              <p>{formik.errors.confirmpassword}</p>
            ) : null}
          </div>
          <div className={styles.footer}>
            <button type="submit">Update</button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ForgotPassword;