import { Routes, Route, Outlet } from 'react-router-dom';

import Login from './Components/Auth/Login';
import Signup from './Components/Auth/Signup';
import VerifyEmail from './Components/Auth/VerifyEmail';
import Dashboard from './Components/Dashboard/Dashboard';
import Navbar from './Components/Navbar/Navbar';
import Courses from './Components/Courses/Courses';
import Pools from './Components/Pools/Pools';
import Notification from './Components/Notifications/Notifications';
<<<<<<< HEAD
import Auth from './Protected/Auth';
import EmailForgotPassword from './Components/Auth/EmailForgotPassword';
import ForgotPassword from './Components/Auth/ForgotPassword';
=======
import EmailForgotPassword from './Components/Auth/EmailForgotPassword';
import ForgotPassword from './Components/Auth/ForgotPassword';
import Profile from './Components/Profile/Profile (1)';
import Auth from './Protected/Auth';
import { v4 as uuidv4 } from 'uuid';
import {ToastContainer, toast } from 'react-toastify';
import Auth2 from './Protected/Auth2';
import Content from './Components/Content/Content';
import Quiz from './Components/Quiz/Quiz';
import Assignment from './Components/Assignment/Assignment';
import Result from './Components/Quiz/Result';
>>>>>>> master


function App() {
  let uid=uuidv4();
  return (
    <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/emailVerification/:id" element={<VerifyEmail />} />
          <Route path="/forgotPassword" element={<EmailForgotPassword/>}/>
          <Route path="/forgotPasswordChange/:id" element={<ForgotPassword/>}/>
<<<<<<< HEAD

          <Route path='/' element={<Auth/>}>
            <Route index path="dashboard" element={<Navbar><Dashboard /></Navbar>} />
            <Route path="courses" element={<Navbar><Courses /></Navbar>} />
            <Route path="pools" element={<Navbar><Pools /></Navbar>} />
            <Route path="notification" element={<Navbar><Notification /></Navbar>} />
          </Route>
          
=======
          <Route path='/' element={<Auth/>} >
            <Route path="/dashboard" element={<Navbar><Dashboard /></Navbar>} />
            <Route path="/courses" element={<Navbar><Courses /></Navbar>} />
            <Route path="/courses/pools" element={<Navbar><Pools /></Navbar>}/>
            <Route path="/courses/content" element={<Navbar><Content /></Navbar>}/>
            <Route path="/courses/quiz" element={<Navbar><Quiz/></Navbar>}/>
            <Route path="/courses/result" element={<Navbar><Result /></Navbar>}/>
            <Route path="/notification" element={<Navbar><Notification /></Navbar>} />
            <Route path="/profile" element={<Navbar><Profile /></Navbar>} />
            <Route path="/courses/assignment" element={<Navbar><Assignment/></Navbar>} />
          </Route>

          <Route path='/' element={<Auth/>} >
          </Route>


>>>>>>> master
        </Routes>
        <ToastContainer autoClose={2000}/>
    </div>
  );
}

export default App;
