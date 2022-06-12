import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import {  Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';



function Auth() {
    const useAuth = useSelector((state) => {
        return state.user.userInfo;
        });    


  let navigate = useNavigate();
  useEffect(() =>
  {
      if (useAuth.length=== 0) navigate('/')
  },[])

  return (
    <Outlet/>
  )
}

export default Auth