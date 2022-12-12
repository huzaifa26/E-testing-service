import { Routes, Route } from 'react-router-dom';

import Login from './Components/Auth/Login';
import Signup from './Components/Auth/Signup';
import VerifyEmail from './Components/Auth/VerifyEmail';
import Dashboard from './Components/Dashboard/Dashboard';
import Navbar from './Components/Navbar/Navbar';
import Courses from './Components/Courses/Courses';
// import Pools from './Components/Pools/Pools';
import Notification from './Components/Notifications/Notifications';
import EmailForgotPassword from './Components/Auth/EmailForgotPassword';
import ForgotPassword from './Components/Auth/ForgotPassword';
import Profile from './Components/Profile/Profile (1)';
import Auth from './Protected/Auth';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import Auth2 from './Protected/Auth2';
import Content from './Components/Content/Content';
import Quiz from './Components/Quiz/Quiz';
import Assignment from './Components/Assignment/Assignment';
import EditQuiz from './Components/Quiz/EditQuiz';
import PoolMain from './Components/Pool/PoolMain';
import PoolQuestions from './Components/Pool/PoolQuestions';
import Setting from './Components/Settings/Setting';
import ManageStudents from './Components/Settings/ManageStudents';
import CreateCourse from './Components/Dashboard/CreateCourse';
import Result from './Components/Quiz/Result';
import Preview from './Components/Quiz/Preview';
import DisplayQuiz from './Components/Quiz/DisplayQuiz';

function App() {
  let uid = uuidv4();

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/emailVerification/:id" element={<VerifyEmail />} />
        <Route path="/forgotPassword" element={<EmailForgotPassword />} />
        <Route path="/forgotPasswordChange/:id" element={<ForgotPassword />} />

        <Route path='/' element={<Auth />} >
          <Route path="/dashboard" element={<Navbar><Dashboard /></Navbar>} />
          <Route path="/dashboard/createCourse" element={<Navbar><CreateCourse /></Navbar>} />
          <Route path="/courses" element={<Navbar><Courses /></Navbar>} />
          <Route path="/courses/pools" element={<Navbar><PoolMain /></Navbar>} />
          <Route path="/courses/poolQuestions" element={<Navbar><PoolQuestions /></Navbar>} />
          <Route path="/courses/content" element={<Navbar><Content /></Navbar>} />
          <Route path="/courses/quiz" element={<Navbar><Quiz /></Navbar>} />
          <Route path="/courses/displayQuiz" element={<Navbar><DisplayQuiz /></Navbar>} />
          <Route path="/courses/preview" element={<Navbar><Preview /></Navbar>} />
          <Route path="/courses/manangeStudents" element={<Navbar><ManageStudents /></Navbar>} />
          <Route path="/courses/setting" element={<Navbar><Setting /></Navbar>} />
          <Route path="/notification" element={<Navbar><Notification /></Navbar>} />
          <Route path="/profile" element={<Navbar><Profile /></Navbar>} />
          <Route path="/courses/assignment" element={<Navbar><Assignment /></Navbar>} />
          <Route path="/courses/assignment/submitResult" element={<Navbar><Assignment /></Navbar>} />
          <Route path="/courses/result" element={<Navbar><Result /></Navbar>} />
          <Route path="/courses/editQuiz" element={<Navbar><EditQuiz /></Navbar>} />
        </Route>

        <Route path='/' element={<Auth />} >
        </Route>
      </Routes>
      <ToastContainer position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
      />
    </div>
  );
}

export default App;
