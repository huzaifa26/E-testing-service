import React, { useState } from 'react'
import './Auth.css'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { toast } from 'react-toastify';
import emailjs from '@emailjs/browser';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { userActions } from './../../Redux/user-slice';
import logo from './../../Assets/logo.png'
import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';



function Auth() {
    const [change, setChange] = useState(false)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loginData = useRef();


    //FOR LOGIN
    const [showPassword0, setShowPassword0] = useState(false);

    function loginSubmitHandler(e) {
        e.preventDefault();
        // if (change) {
        //     return
        // }
        console.log(' i ran');
        axios.post('http://localhost:5000/api/login', {
            email: loginData.current.email.value,
            password: loginData.current.password.value,
        }, { withCredentials: true })
            .then(function (response) {

                if (response.status === 200) {
                    dispatch(userActions.userInfo(response.data));
                    toast.success('Login Succesfull', {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                    navigate('/dashboard');
                }
                if (response?.response?.status === 400) {
                    toast.error('Wrong Password', {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
                if (response?.response?.status === 403) {
                    toast.error('Please create account first', {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
                if (response?.response?.status === 409) {
                    toast.error('Please verify your email', {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }

            })
            .catch(function (error) {
                console.log(error);

                if (error.status === 401) {
                    toast.error('Please create account', {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
                if (error.status === 400 || error.status === 403) {
                    toast.error('Wrong Email or Password', {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
                if (error.status === 409) {
                    toast.error('Please verify email', {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
            });
    }


    //FOR SIGNUP

    const [showPassword, setShowPassword] = useState(false);
    const [showPassword1, setShowPassword1] = useState(false);

    const handleSignup = (event) => {
        event.preventDefault();
        console.log('hehe')
        setChange(true)
    }

    const MailService = async (data) => {
        console.log("IN MAILSERVICE FUNCTION");
        data.link = 'http://localhost:3000/emailVerification/' + data.id;
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
            password: Yup.string().required('Please Enter your password').matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/,
                "Must Contain 6 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"),
            confirmpassword: Yup.string().required('Password is required').oneOf(
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
                        setChange(false)
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
        // <div className='body'>
        <div className={change ? "container2 sign-up-mode" : "container2"}>
            <div className="forms">
                <div className="signin-signup">
                    <form autoComplete="off" onSubmit={loginSubmitHandler} className="form sign-in-form" ref={loginData}>
                        <div className="bg-white px-6 py-3 rounded-[10px] min-w-[300px] shadow-lg w-[21.216vw]">
                            <div className="flex flex-col items-center justify-center mt-[1.271vh] mb-4">
                                <h2 className="text-[clamp(32px,1.978vw,81px)] font-[900]">Login</h2>
                            </div>
                            {/* <!-- username --> */}
                            <div className="flex flex-col my-2">
                                <label className="text-[clamp(14px,0.801vw,32.82px)] font-bold text-[#000000] ">Email</label>
                                <input autoComplete="off" role="presentation" required name="email" className="emailIcon text-[clamp(14px,0.586vw,24px)] border-b-[0.23148148148148vh] rounded px-3 py-1 mt-2 h-[40px]" type="text" placeholder="Type your email" />
                            </div>
                            <div className="flex flex-col mt-10 relative">
                                <label className="text-[clamp(14px,0.801vw,32.82px)] font-bold text-[#000000]">Password</label>
                                <input autoComplete="new-password" required name="password" className="passwordIcon text-[clamp(14px,0.586vw,24px)] border-b-[0.23148148148148vh] rounded px-3 py-1 mt-2 h-[40px]" type={showPassword0 === false ? "password" : "text"} placeholder="Type your password" />
                                {showPassword0 === false &&
                                    <div onClick={() => { setShowPassword0(true) }} className='w-[20px] cursor-pointer absolute right-[3%] top-[60%]'>
                                        <img src='./eye-solid.svg' />
                                    </div>
                                }
                                {showPassword0 === true &&
                                    <div onClick={() => { setShowPassword0(false) }} className='w-[22px] cursor-pointer absolute right-[3%] top-[60%]'>
                                        <img src='./eye-slash-solid.svg' />
                                    </div>
                                }
                            </div>
                            <div className="flex flex-col items-center justify-center my-3">
                                <div className="flex w-full items-center justify-end text-xs text-gray-500">
                                    <p onClick={() => { navigate('/forgotPassword'); }} className="text-[clamp(12px,0.659vw,27px)] text-[#000] font-semibold cursor-pointer hover:text-blue-400">Forgot password?</p>
                                </div>
                                <button type='submit' style={{ boxShadow: "0px 0px 0px rgba(0,0,0,0)" }} className="button h-[4.3518518518519vh] min-w-[150px] min-h-[30px] !mt-[2.051vh] !mb-[1.221vh] rounded-full !py-1 !text-[clamp(14px,0.801vw,32.82px)] bg-[#81c2ff] !text-white !uppercase !font-bold">
                                    Login
                                </button>
                                <button type="button" onClick={handleSignup} style={{ background: "white", color: "white", boxShadow: "0px 0px 0px rgba(0,0,0,0)" }} className="button !mb-[4.443vh] min-w-[150px] min-h-[30px] !my-1 !py-1 !text-[clamp(14px,0.801vw,32.82px)] !bg-white !border-2 !border-[#303035] !text-[#303035] !font-bold !uppercase">
                                    Signup
                                </button>
                            </div>
                        </div>
                    </form>

                    <form autoComplete="off" onSubmit={(e) => { e.preventDefault(); console.log('s'); formik.handleSubmit() }} className="form sign-up-form">
                        <div className="bg-white px-6 py-3 rounded-[10px] min-w-[300px] shadow-lg w-[25.216vw]">
                            <div className="flex flex-col items-center justify-center mt-[1.271vh] mb-4">
                                <h2 className="text-[clamp(32px,1.978vw,81px)] font-[900]">Sign Up</h2>
                            </div>
                            <div className="flex flex-col my-4">
                                <label className="text-[clamp(14px,0.801vw,32.82px)] font-bold text-[#000000] ">Email</label>
                                <input autoComplete="off" className="emailIcon text-[clamp(14px,0.586vw,24px)] border-b-[0.23148148148148vh] rounded px-3 py-1 mt-2 h-[40px]" type="email" id="email" placeholder="Please type your email" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} />
                                {formik.touched.email && formik.errors.email ? (<p className='text-[12px] text-[#FF1E00]'>{formik.errors.email}</p>) : null}
                            </div>

                            <div className="flex flex-col my-4">
                                <label className="text-[clamp(14px,0.801vw,32.82px)] font-bold text-[#000000] ">Name</label>
                                <input autoComplete="off" className="userIcon text-[clamp(14px,0.586vw,24px)] border-b-[0.23148148148148vh] rounded px-3 py-1 mt-2 h-[40px]" type="text" id="username" placeholder="Please type your name" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.username} />
                                {formik.touched.username && formik.errors.username ? (<p className='text-[12px] text-[#FF1E00]'>{formik.errors.username}</p>) : null}
                            </div>

                            <div className="flex flex-col my-4 relative">
                                <label className="text-[clamp(14px,0.801vw,32.82px)] font-bold text-[#000000]">Password</label>
                                <input autoComplete="off" className="passwordIcon text-[clamp(14px,0.586vw,24px)] border-b-[0.23148148148148vh] rounded px-3 py-1 mt-2 h-[40px]" type={showPassword === false ? "password" : "text"} id="password" placeholder="Please type your password" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password} />
                                {showPassword === false &&
                                    <div onClick={() => { setShowPassword(true) }} className='w-[20px] cursor-pointer absolute right-[3%] top-[60%]'>
                                        <img src='./eye-solid.svg' />
                                    </div>
                                }
                                {showPassword === true &&
                                    <div onClick={() => { setShowPassword(false) }} className='w-[22px] cursor-pointer absolute right-[3%] top-[60%]'>
                                        <img src='./eye-slash-solid.svg' />
                                    </div>
                                }
                                {formik.touched.password && formik.errors.password ? (<p className='text-[12px] text-[#FF1E00]'>{formik.errors.password}</p>) : null}
                            </div>

                            <div className="flex flex-col my-4 relative">
                                <label className="text-[clamp(14px,0.801vw,32.82px)] font-bold text-[#000000]">Confirm Password</label>
                                <input autoComplete="off" className="fill passwordIcon text-[clamp(14px,0.586vw,24px)] border-b-[0.23148148148148vh] rounded px-3 py-1 mt-2 h-[40px]" id="confirmpassword" type={showPassword1 === false ? "password" : "text"} placeholder="Please confirm your password" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.confirmpassword} />
                                {showPassword1 === false &&
                                    <div onClick={() => { setShowPassword1(true) }} className='w-[20px] cursor-pointer absolute right-[3%] top-[60%]'>
                                        <img src='./eye-solid.svg' />
                                    </div>
                                }
                                {showPassword1 === true &&
                                    <div onClick={() => { setShowPassword1(false) }} className='w-[22px] cursor-pointer absolute right-[3%] top-[60%]'>
                                        <img src='./eye-slash-solid.svg' />
                                    </div>
                                }
                                {formik.touched.confirmpassword && formik.errors.confirmpassword ? (<p className='text-[12px] text-[#FF1E00]'>{formik.errors.confirmpassword}</p>) : null}
                            </div>

                            <div className="flex flex-col items-center justify-center my-3">
                                <button type='submit' style={{ boxShadow: "0px 0px 0px rgba(0,0,0,0)" }} className="button !mt-[2.051vh] !mb-[1.221vh] !py-1 !text-[clamp(14px,0.801vw,32.82px)] bg-[#81c2ff] !text-white !uppercase !font-bold">
                                    Signup
                                </button>
                                <p className='text-[14px] font-[400] '>Already have account? <span className='font-[900] cursor-pointer hover:text-blue-400' onClick={() => setChange(false)}>Login</span></p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className="panels-container">
                <div className="panel left-panel">
                    <div className="content">

                    </div>
                    <img src={logo} className="image" alt="girl phone" />
                </div>
                <div className="panel right-panel">
                    <div className="content">
                    </div>
                    <img src={logo} className="image" alt="girl sofa" />
                </div>
            </div>
        </div>
        // </div >
    )
}

export default Auth