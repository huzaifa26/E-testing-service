import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CookiesProvider } from "react-cookie";
import { Provider } from 'react-redux';
import redux from './Redux/index';
import axios, { AxiosError } from 'axios';

const axiosApiInstance = axios.create({
  baseURL: 'http://localhost:5000/api/',
  withCredentials:true
});

axios.interceptors.request.use(async(req)=>{
  return req;
}, err=> {return Promise.resolve(err)}
)

axios.interceptors.response.use((response)=>{
  return response;
}, async (error) => {
  const originalRequest = error.config;
  if (error.response.status === 403 && !originalRequest._retry) {
    originalRequest._retry = true;
    axios.get("http://localhost:5000/api/refreshtoken",{withCredentials:true}).then((res)=>{
      axios.defaults.withCredentials=true;
    }).catch((err)=>{
      console.log(err);
    })
    return axios(originalRequest);
  }
  return Promise.resolve(error);
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <CookiesProvider>
    <BrowserRouter>
      <Provider store={redux}>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </Provider>
    </BrowserRouter>
  </CookiesProvider>,
);