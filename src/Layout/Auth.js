import React, { useEffect } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { userActions } from '../Redux/user-slice';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { useState } from "react";

function Auth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation()
  const [cookies, setCookie, removeCookies] = useCookies();

  const user = useSelector(state => state.user.userInfo);
  console.log();


  // useEffect(() => {
  //   if () {
  //     navigate('/');
  //   }
  // }, [])

  // return (
  //   <Outlet />
  // )


  return cookies.token === undefined ? (
    (<Navigate to="/Unauthorized" state={{ from: location }} replace />)
  ) :
    <Outlet />

}
export default Auth;