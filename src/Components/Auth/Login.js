import styles from './Login.module.css';
import { useRef, useState } from 'react';
import axios from 'axios';
import image from './../../Assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
<<<<<<< HEAD
import { userActions } from './../../Redux/user-slice';
=======
import { userActions } from './../../Redux/user-slice'; 
import { useCookies } from 'react-cookie';
import ClipLoader from "react-spinners/ClipLoader";
>>>>>>> master

function Login() {
  const [cookies, setCookie] = useCookies(['user']);
  let [loading, setLoading] = useState(false);

  const dispatch=useDispatch();
  const loginData = useRef();
  const dispatch = useDispatch();
  let navigate = useNavigate();

  function loginSubmitHandler(e) {
    e.preventDefault();
    setLoading(true);

    axios.post('http://localhost:5000/api/login', {
        email: loginData.current.email.value,
        password: loginData.current.password.value,
      },{withCredentials : true})
      .then(function (response) {
        console.log();

        if (response.status === 200) {
          // console.log(response.data)
<<<<<<< HEAD
          dispatch(userActions.userInfo(response.data));

          
          // const accessToken =response.data.accessToken
          // setAuth({email,password,roles,accessToken })
=======
          console.log(response.data)
          // setCookie('token', response.data.token, { path: '/' });
          dispatch(userActions.userInfo(response.data));
          toast.success('Login Succesfull', {
            position: toast.POSITION.TOP_RIGHT,
          });
>>>>>>> master
          navigate('/dashboard');
        } else if (response?.response?.status === 400) {
          toast.error('Wrong Email or Password', {
            position: toast.POSITION.TOP_RIGHT,
          });
<<<<<<< HEAD
        }
        if (error.response.status === 403) {
          toast.error('Wrong password', {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
        if (error.response.status === 405) {
          toast.warning('Please verify email', {
=======
        } else  if (response?.response?.status === 405) {
          toast.error('Please verify email', {
>>>>>>> master
            position: toast.POSITION.TOP_RIGHT,
          });
        }
        setLoading(false)
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
        setLoading(false)
      });
  }


  return (
    <div className={styles.LoginMain}>
      <div className={styles.LoginImage}>
        <img src={image} alt="logo"></img>
      </div>
      <div className={styles.LoginContainer}>
        <form className={styles.LoginForm} ref={loginData} onSubmit={loginSubmitHandler}>
          <h1 className={styles.LoginName}>LOGIN</h1>
<<<<<<< HEAD
          <input type="email" name="email" placeholder="Email"></input>
          <input type="password" name="password" placeholder="Password"></input>
          <p className={styles.LoginFormForget} onClick={() => {
                  navigate('/forgotPassword');
                }}>forget password?</p>
=======
          <input required type="email" name="email" placeholder="Email"></input>
          <input required type="password" name="password" placeholder="Password"></input>
          <p className={styles.LoginFormForget} onClick={() => {navigate('/forgotPassword');}}>forget password?</p>
>>>>>>> master
          <div className={styles.footer}>
            {loading === false?
          <button type='submit'>Login</button>
            :
            <button type='button'><ClipLoader loading={true} color={"#777"} size={20} /></button>
            }
            <p className={styles.LoginFormAlready} onClick={() => {navigate('/signup');}}>
              Create Account
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
