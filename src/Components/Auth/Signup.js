import React from 'react';
import styles from './Signup.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import image from './../../Assets/logo.png';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import emailjs from '@emailjs/browser';

const MailService = async (data) => {
  console.log("IN MAILSERVICE FUNCTION");
  data.link = 'http://localhost:3000/emailVerification/' + data.id;
  emailjs
    .send('service_gvyqi7g', 'template_ojllmfn', data, 'PCrkZDdTgRVPTxMHf')
    .then(
      (result) => {
        console.log(result.text);
      },
      (error) => {
        console.log(error.text);
      }
    );
};

function Signup() {
  let navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmpassword: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Required'),
      email: Yup.string()
        .required('Valid email required')
        .email('Valid email required'),
      password: Yup.string().required('Password is required'),
      confirmpassword: Yup.string().oneOf(
        [Yup.ref('password'), null],
        'Passwords must match'
      ),
    }),
    onSubmit: (values, { resetForm }) => {
      axios
        .post('http://localhost:5000/api/signup', {
          fullName: values.username,
          email: values.email,
          password: values.password,
        })
        .then(function (response) {
          console.log(response);
          if (response?.status === 200) {
            MailService(response.data);
            toast.success('Check your Email to verify', {
              position: toast.POSITION.TOP_RIGHT,
            });
          } else if (response?.response?.status === 400) {
            toast.error('Account with this email already exists', {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
        })
        .catch(function (error) {
          if (error.response.status === 400) {
            toast.error('Account with this email already exists', {
              position: toast.POSITION.TOP_RIGHT,
            });
          } else if (error.response.status === 500) {
            toast.error('Error Registering User', {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
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
          <h1 className={styles.SignupName}>Sign Up</h1>
          <div className={styles.field}>
            <input
              type="text"
              id="username"
              placeholder="Full Name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
            />
            {formik.touched.username && formik.errors.username ? (
              <p>{formik.errors.username}</p>
            ) : null}
          </div>
          <div className={styles.field}>
            <input
              type="email"
              id="email"
              placeholder="Email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <p>{formik.errors.email}</p>
            ) : null}
          </div>
          <div className={styles.field}>
            <input
              type="password"
              id="password"
              placeholder="Password"
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
              placeholder=" Confirm Password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmpassword}
            />
            {formik.touched.confirmpassword && formik.errors.confirmpassword ? (
              <p>{formik.errors.confirmpassword}</p>
            ) : null}
          </div>
          <div className={styles.footer}>
            <button type="submit">Sign Up</button>
            <p className={styles.SignupFormAlready}>
              Already have an account?{' '}
              <span
                onClick={() => {
                  navigate('/');
                }}
              >
                Login
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
