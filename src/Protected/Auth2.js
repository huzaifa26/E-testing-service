import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import {  Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';


function Auth2() {
  const [cookies, setCookie,removeCookies] = useCookies(['user']);
  const user = useSelector((state) => state.user.userInfo);
  let navigate = useNavigate();

  useEffect(() =>{
      // if (!cookies.token) navigate('/');

      if (user.hasOwnProperty("user") === false) navigate('/dashboard');
  },[])

  return (
    <Outlet/>
  )
}
export default Auth2;