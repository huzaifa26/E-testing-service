import { Routes, Route } from 'react-router-dom';

import Login from './Components/Auth/Login';
import Signup from './Components/Auth/Signup';
import VerifyEmail from './Components/Auth/VerifyEmail';
import Dashboard from './Components/Dashboard/Dashboard';
import Navbar from './Components/Navbar/Navbar';
import Courses from './Components/Courses/Courses';
import Pools from './Components/Pools/Pools';
import Notification from './Components/Notifications/Notifications';
import EmailForgotPassword from './Components/Auth/EmailForgotPassword';
import ForgotPassword from './Components/Auth/ForgotPassword';
import Profile from './Components/Profile/Profile (1)';
import Auth from './Protected/Auth';
import { v4 as uuidv4 } from 'uuid';

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
          

          <Route path='/' element={<Auth/>} >
            <Route path="/dashboard" element={<Navbar><Dashboard key={uid}/></Navbar>} />
            <Route path="/courses" element={<Navbar><Courses /></Navbar>} />
            <Route path="/courses/pools" element={<Navbar><Pools /></Navbar>}/>
            <Route path="/notification" element={<Navbar><Notification /></Navbar>} />
            <Route path="/profile" element={<Navbar><Profile /></Navbar>} />
          </Route>

        </Routes>
    </div>
  );
}

export default App;
