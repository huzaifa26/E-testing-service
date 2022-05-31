import styles from './Login.module.css';
import { useRef } from 'react';
import axios from 'axios';
import image from './../../Assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const loginData = useRef();
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
          toast.error('Please verify email', {
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
          <p className={styles.LoginFormForget}>forget password?</p>
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
