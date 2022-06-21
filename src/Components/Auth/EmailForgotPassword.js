import React from 'react';
import styles from './EmailForgotPassword.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import image from './../../Assets/logo.png';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import emailjs from '@emailjs/browser';

const MailService = async (data) => {
  console.log(data.id)
  data.link = 'http://localhost:3000/forgotPasswordChange/' + data.id;
  emailjs
    .send('service_vimsp8b', 'template_n2tq68o', data, '_skPtTuhpdi0bie5x')
    .then(
      (result) => {
        console.log(result.text);
        toast.success('Check your Email to verify', {
          position: toast.POSITION.TOP_RIGHT,
        });
      },
      (error) => {
        console.log(error.text);
      }
    );
};


function EmailForgotPassword() {

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required('Valid email required')
        .email('Valid email required'),
    }),
    onSubmit: (values, { resetForm }) => {
      axios
        .post('http://localhost:5000/api/forgotPassword', {
          email: values.email,
        })
        .then(function (response) {
          if (response.status === 200)
         { console.log(response.data)
          MailService(response.data);}
          else if(response.status === 204)
          toast.warning('You have no account', {
            position: toast.POSITION.TOP_RIGHT,
          });
        })
        .catch(function (error) {
          if (error.response.status === 403)
          toast.warning('Please verify your email first', {
            position: toast.POSITION.TOP_RIGHT,
          });
          else
          console.log(error)
        });
    },
  });

  return (
    <div className={styles.ForgotPasswordMain}>
      <div className={styles.ForgotPasswordImage}>
        <img src={image} alt="logo"></img>
      </div>
      <div className={styles.ForgotPasswordContainer}>
        <form
          className={styles.ForgotPasswordForm}
          onSubmit={(e) => {
            e.preventDefault();
            formik.handleSubmit();
          }}
        >
          <h1 className={styles.ForgotPasswordName}>Forgot Your Password?</h1>
          <p className={styles.p}><i>Enter your email and we'll send you a link to get back to your account</i></p>
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
          <div className={styles.footer}>
            <button type="submit">Send</button>
            
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmailForgotPassword;