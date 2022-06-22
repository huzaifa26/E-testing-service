import styles from './Login.module.css';
import { useRef } from 'react';
import axios from 'axios';
import image from './../../Assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { userActions } from './../../Redux/user-slice'; 
import { useCookies } from 'react-cookie';

function Login() {
  const [cookies, setCookie] = useCookies(['user']);

  const dispatch=useDispatch();
  const loginData = useRef();
  let navigate = useNavigate();

  function loginSubmitHandler(e) {
    e.preventDefault();

    axios.post('http://localhost:5000/api/login', {
        email: loginData.current.email.value,
        password: loginData.current.password.value,
      },{withCredentials : true})
      .then(function (response) {
        console.log();

        if (response.status === 200) {
          // console.log(response.data)
          console.log(response.data)
          // setCookie('token', response.data.token, { path: '/' });
          dispatch(userActions.userInfo(response.data));
          toast.success('Login Succesfull', {
            position: toast.POSITION.TOP_RIGHT,
          });
          navigate('/dashboard');
        } else if (response?.response?.status === 400) {
          toast.error('Wrong Email or Password', {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else  if (response?.response?.status === 405) {
          toast.error('Please verify email', {
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
        if (error.status === 400) {
          toast.error('Wrong Email or Password', {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
        if (error.status === 405) {
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
          <input required type="email" name="email" placeholder="Email"></input>
          <input required type="password" name="password" placeholder="Password"></input>
          <p className={styles.LoginFormForget} onClick={() => {navigate('/forgotPassword');}}>forget password?</p>
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
    </div>
  );
}

export default Login;
