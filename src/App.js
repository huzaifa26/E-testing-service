import { Routes, Route, Outlet } from 'react-router-dom';

import Login from './Components/Auth/Login';
import Signup from './Components/Auth/Signup';
import VerifyEmail from './Components/Auth/VerifyEmail';
import Dashboard from './Components/Dashboard/Dashboard';
import Navbar from './Components/Navbar/Navbar';
import Courses from './Components/Courses/Courses';
import Pools from './Components/Pools/Pools';
import Notification from './Components/Notifications/Notifications';
import Auth from './Protected/Auth';
import EmailForgotPassword from './Components/Auth/EmailForgotPassword';
import ForgotPassword from './Components/Auth/ForgotPassword';


function App() {
  return (
    <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/emailVerification/:id" element={<VerifyEmail />} />
          <Route path="/forgotPassword" element={<EmailForgotPassword/>}/>
          <Route path="/forgotPasswordChange/:id" element={<ForgotPassword/>}/>

          <Route path='/' element={<Auth/>}>
            <Route index path="dashboard" element={<Navbar><Dashboard /></Navbar>} />
            <Route path="courses" element={<Navbar><Courses /></Navbar>} />
            <Route path="pools" element={<Navbar><Pools /></Navbar>} />
            <Route path="notification" element={<Navbar><Notification /></Navbar>} />
          </Route>
          
        </Routes>
    </div>
  );
}

export default App;
