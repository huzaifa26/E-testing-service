import React, { useState } from 'react';
import styles from './Signup.module.css';
import { Link, useNavigate } from 'react-router-dom';
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
    .send('service_ctpq9uj', 'template_hlh17gl', data, 'PCrkZDdTgRVPTxMHf')
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
            navigate('/');
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

  const [showPassword,setShowPassword]=useState(false);
  const [showPassword1,setShowPassword1]=useState(false);


  return (
    // <div className={styles.SignupMain}>
    //   <div className={styles.SignupImage}>
    //     <img src={image} alt="logo"></img>
    //   </div>
    //   <div className={styles.SignupContainer}>
    //     <form onSubmit={(e) => { e.preventDefault(); formik.handleSubmit();}}>
    //       <h1 className={styles.SignupName}>Sign Up</h1>
    // <div className={styles.field}>
    //   <input
    //     type="text"
    //     id="username"
    //     placeholder="Full Name"
    //     onChange={formik.handleChange}
    //     onBlur={formik.handleBlur}
    //     value={formik.values.username}
    //   />
    //   {formik.touched.username && formik.errors.username ? (
    //     <p>{formik.errors.username}</p>
    //   ) : null}
    // </div>
    // <div className={styles.field}>
    //   <input
    //     type="email"
    //     id="email"
    //     placeholder="Email"
    //     onChange={formik.handleChange}
    //     onBlur={formik.handleBlur}
    //     value={formik.values.email}
    //   />
    //   {formik.touched.email && formik.errors.email ? (
    //     <p>{formik.errors.email}</p>
    //   ) : null}
    // </div>
    // <div className={styles.field}>
    // <input
    //   type="password"
    //   id="password"
    //   placeholder="Password"
    //   onChange={formik.handleChange}
    //   onBlur={formik.handleBlur}
    //   value={formik.values.password}
    // />
    // {formik.touched.password && formik.errors.password ? (
    //   <p>{formik.errors.password}</p>
    // ) : null}
    // </div>
    // <div className={styles.field}>
    // <input
    //   id="confirmpassword"
    //   type="password"
    //   placeholder=" Confirm Password"
    //   onChange={formik.handleChange}
    //   onBlur={formik.handleBlur}
    //   value={formik.values.confirmpassword}
    //   required
    // />
    // {formik.touched.confirmpassword && formik.errors.confirmpassword ? (
    //   <p>{formik.errors.confirmpassword}</p>
    // ) : null}
    // </div>
    //       <div className={styles.footer}>
    //         <button type="submit">Sign Up</button>
    //         <p className={styles.SignupFormAlready}>
    //           Already have an account?{' '}
    //           <span
    //             onClick={() => {
    //               navigate('/');
    //             }}
    //           >
    //             Login
    //           </span>
    //         </p>
    //       </div>
    //     </form>
    //   </div>
    // </div>
    <div className='bg-[#F0F2F5] h-screen w-screen flex justify-center items-center'>
      <div className="bg-white px-6 py-3 rounded-[10px] min-w-[300px] shadow-lg w-[25.216vw]">
        <div className="flex flex-col items-center justify-center mt-[1.271vh] mb-4">
          <h2 className="text-[clamp(32px,1.978vw,81px)] font-[900]">Sign Up</h2>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); formik.handleSubmit() }}>
          <div className="flex flex-col my-4">
            <label className="text-[clamp(14px,0.801vw,32.82px)] font-bold text-[#000000] ">Email</label>
            <input className="emailIcon text-[clamp(14px,0.586vw,24px)] border-b-[0.23148148148148vh] rounded px-3 py-1 mt-2 h-[40px]" type="email" id="email" placeholder="Please type your email" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email}/>
            {formik.touched.email && formik.errors.email ? (<p className='text-[12px] text-[#999999]'>{formik.errors.email}</p>) : null}
          </div>

          <div className="flex flex-col my-4">
            <label className="text-[clamp(14px,0.801vw,32.82px)] font-bold text-[#000000] ">Name</label>
            <input className="userIcon text-[clamp(14px,0.586vw,24px)] border-b-[0.23148148148148vh] rounded px-3 py-1 mt-2 h-[40px]" type="text" id="username" placeholder="Please type your name" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.username}/>
            {formik.touched.username && formik.errors.username ? (<p className='text-[12px] text-[#999999]'>{formik.errors.username}</p>) : null}
          </div>

          <div className="flex flex-col my-4 relative">
            <label className="text-[clamp(14px,0.801vw,32.82px)] font-bold text-[#000000]">Password</label>
            <input className="passwordIcon text-[clamp(14px,0.586vw,24px)] border-b-[0.23148148148148vh] rounded px-3 py-1 mt-2 h-[40px]" type={showPassword===false?"password":"text"} id="password" placeholder="Please type your password" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password}/>
            {showPassword === false &&
            <div onClick={()=>{setShowPassword(true)}} className='w-[20px] cursor-pointer absolute right-[3%] top-[60%]'>
              <img src='./eye-solid.svg'/>
            </div>
            }
            {showPassword === true &&
            <div onClick={()=>{setShowPassword(false)}} className='w-[22px] cursor-pointer absolute right-[3%] top-[60%]'>
              <img src='./eye-slash-solid.svg'/>
            </div>
            }
            {formik.touched.password && formik.errors.password ? (<p className='text-[12px] text-[#999999]'>{formik.errors.password}</p>) : null}
          </div>

          <div className="flex flex-col my-4 relative">
            <label className="text-[clamp(14px,0.801vw,32.82px)] font-bold text-[#000000]">Confirm Password</label>
            <input className="passwordIcon text-[clamp(14px,0.586vw,24px)] border-b-[0.23148148148148vh] rounded px-3 py-1 mt-2 h-[40px]" id="confirmpassword" type={showPassword1===false?"password":"text"} placeholder="Please confirm your password" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.confirmpassword} required/>
            {showPassword1 === false &&
            <div onClick={()=>{setShowPassword1(true)}} className='w-[20px] cursor-pointer absolute right-[3%] top-[60%]'>
              <img src='./eye-solid.svg'/>
            </div>
            }
            {showPassword1 === true &&
            <div onClick={()=>{setShowPassword1(false)}} className='w-[22px] cursor-pointer absolute right-[3%] top-[60%]'>
              <img src='./eye-slash-solid.svg'/>
            </div>
            }
            {formik.touched.confirmpassword && formik.errors.confirmpassword ? (<p className='text-[12px] text-[#999999]'>{formik.errors.confirmpassword}</p>) : null}
          </div>

          <div className="flex flex-col items-center justify-center my-3">
            <button style={{ boxShadow: "0px 0px 0px rgba(0,0,0,0)" }} className="button !mt-[2.051vh] !mb-[1.221vh] !py-1 !text-[clamp(14px,0.801vw,32.82px)] bg-[#81c2ff] !text-white !uppercase !font-bold">
              Signup
            </button>
            <p className='text-[14px] font-[400] '>Already have account? <Link className='font-[900] cursor-pointer hover:text-blue-400' to="/">Login</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
