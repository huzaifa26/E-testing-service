import styles from './Login.module.css';
import { useRef } from 'react';
import axios from 'axios';
import image from './../../Assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { userActions } from './../../Redux/user-slice';

function Login() {
  const loginData = useRef();
  const dispatch = useDispatch();
  let navigate = useNavigate();

  function loginSubmitHandler(e) {
    e.preventDefault();

    axios
      .post('http://localhost:5000/api/login', {
        email: loginData.current.email.value,
        password: loginData.current.password.value,
      })
      .then(function (response) {
        if (response.status === 200) {
          // console.log(response.data)
          dispatch(userActions.userInfo(response.data));

          
          // const accessToken =response.data.accessToken
          // setAuth({email,password,roles,accessToken })
          navigate('/dashboard');
        }
      })
      .catch(function (error) {
        if (error.response.status === 401) {
          toast.error('Please create account', {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
        if (error.response.status === 403) {
          toast.error('Wrong password', {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
        if (error.response.status === 405) {
          toast.warning('Please verify email', {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      });
  }

  return (
    <div className={styles.LoginMain}>
      <div className={styles.LoginImage}>
        <img src={image} alt="logo"></img>
      </div>
      <div className={styles.LoginContainer}>
        <form
          className={styles.LoginForm}
          ref={loginData}
          onSubmit={loginSubmitHandler}
        >
          <h1 className={styles.LoginName}>LOGIN</h1>
          <input type="email" name="email" placeholder="Email"></input>
          <input type="password" name="password" placeholder="Password"></input>
          <p className={styles.LoginFormForget} onClick={() => {
                  navigate('/forgotPassword');
                }}>forget password?</p>
          <div className={styles.footer}>
            <button>Login</button>
            <p
              className={styles.LoginFormAlready}
              onClick={() => {
                navigate('/signup');
              }}
            >
              Create Account
            </p>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
