import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import {  Outlet } from 'react-router-dom';
<<<<<<< HEAD
import { useSelector } from 'react-redux';



function Auth() {
    const useAuth = useSelector((state) => {
        return state.user.userInfo;
        });    


  let navigate = useNavigate();
  useEffect(() =>
  {
      if (useAuth.length=== 0) navigate('/')
=======
import { useCookies } from 'react-cookie';
import { userActions } from '../Redux/user-slice';
import { useSelector,useDispatch } from 'react-redux';
import axios from 'axios';
import {useState} from "react";

function Auth() {
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const [cookies, setCookie,removeCookies] = useCookies();
  const useAuth = useSelector((state) => state.user.userInfo);
  const user=useSelector(state=> state.user);

  const [cookiesState,setCookies]=useState();

  useEffect(() =>{
    console.log(cookies.token);
      if (cookies.token === undefined) {
        navigate('/');
      }
>>>>>>> master
  },[])

  return (
    <Outlet/>
  )
}
<<<<<<< HEAD

export default Auth
=======
export default Auth;
>>>>>>> master
