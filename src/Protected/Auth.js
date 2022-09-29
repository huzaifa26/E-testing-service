import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import {  Outlet } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { userActions } from '../Redux/user-slice';
import { useSelector,useDispatch } from 'react-redux';
import axios from 'axios';
import {useState} from "react";

function Auth() {
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const [cookies, setCookie,removeCookies] = useCookies();

  useEffect(() =>{
    console.log(cookies.token);
      if (cookies.token === undefined) {
        navigate('/');
      }
  },[])

  return (
    <Outlet/>
  )
}
export default Auth;