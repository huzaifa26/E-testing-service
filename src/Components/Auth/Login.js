import styles from './Login.module.css';
import { useRef, useState } from 'react';
import axios from 'axios';
import image from './../../Assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { userActions } from './../../Redux/user-slice';
import { useCookies } from 'react-cookie';

function Login() {
  const [cookies, setCookie] = useCookies(['user']);

  const dispatch = useDispatch();
  const loginData = useRef();
  let navigate = useNavigate();

  function loginSubmitHandler(e) {
    e.preventDefault();

    axios.post('http://localhost:5000/api/login', {
      email: loginData.current.email.value,
      password: loginData.current.password.value,
    }, { withCredentials: true })
      .then(function (response) {
        console.log();

        if (response.status === 200) {
          dispatch(userActions.userInfo(response.data));
          toast.success('Login Succesfull', {
            position: toast.POSITION.TOP_RIGHT,
          });
          navigate('/dashboard');
        } else if (response?.response?.status === 400) {
          toast.error('Wrong Email or Password', {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else if (response?.response?.status === 405 || response?.response?.status === 403) {
          toast.error('Please verify email or create account', {
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
        if (error.status === 405) {
          toast.error('Please verify email', {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      });
  }

  const [showPassword,setShowPassword]=useState(false);

  return (
    <div class='bg-[#F0F2F5] h-screen w-screen flex justify-center items-center'>
      {/* <img src={image} className='absolute top-[5%] left-[5%] w-[10%]'/> */}
      <div class="bg-white px-6 py-3 rounded-[10px] min-w-[300px] shadow-lg w-[21.216vw]">
        <div class="flex flex-col items-center justify-center mt-[1.271vh] mb-4">
          <h2 class="text-[clamp(32px,1.978vw,81px)] font-[900]">Login</h2>
        </div>
        <form onSubmit={loginSubmitHandler} ref={loginData}>
          {/* <!-- username --> */}
          <div class="flex flex-col my-2">
            <label class="text-[clamp(14px,0.801vw,32.82px)] font-bold text-[#000000] ">Email</label>
            <input name="email" class="emailIcon text-[clamp(14px,0.586vw,24px)] border-b-[0.23148148148148vh] rounded px-3 py-1 mt-2 h-[40px]" type="text" placeholder="Type your email" />
          </div>
          <div class="flex flex-col mt-10 relative">
            <label class="text-[clamp(14px,0.801vw,32.82px)] font-bold text-[#000000]">Password</label>
            <input name="password" class="passwordIcon text-[clamp(14px,0.586vw,24px)] border-b-[0.23148148148148vh] rounded px-3 py-1 mt-2 h-[40px]" type={showPassword===false?"password":"text"} placeholder="Type your password" />
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
          </div>
          <div class="flex flex-col items-center justify-center my-3">
            <div class="flex w-full items-center justify-end text-xs text-gray-500">
              <p onClick={() => { navigate('/forgotPassword'); }} className="text-[clamp(12px,0.659vw,27px)] text-[#000] font-semibold cursor-pointer hover:text-blue-400">Forgot password?</p>
            </div>
            <button style={{ boxShadow: "0px 0px 0px rgba(0,0,0,0)" }} class="button h-[4.3518518518519vh] min-w-[150px] min-h-[30px] !mt-[2.051vh] !mb-[1.221vh] rounded-full !py-1 !text-[clamp(14px,0.801vw,32.82px)] bg-[#81c2ff] !text-white !uppercase !font-bold">
              Login
            </button>
            <button onClick={() => { navigate('/signup') }} style={{ background: "white", color: "white", boxShadow: "0px 0px 0px rgba(0,0,0,0)" }} class="button !mb-[4.443vh] min-w-[150px] min-h-[30px] !my-1 !py-1 !text-[clamp(14px,0.801vw,32.82px)] !bg-white !border-2 !border-[#303035] !text-[#303035] !font-bold !uppercase">
              Signup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
