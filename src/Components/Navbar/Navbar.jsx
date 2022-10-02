import './Navbar.css';
import image from '../../Assets/logo.png';
import React, { useState } from 'react';
import { Link,NavLink,useLocation,useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { userActions } from './../../Redux/user-slice'; 
import { courseActions,courseCategoriesActions,getCourseIdOnClickactions,courseId_NameActions } from './../../Redux/course-slice';

const Navbar2= (props) => {
  
  const user=useSelector(state=> state.user);
  const courseIdredux=useSelector(state => state.getCourseIdOnClick.getCourseIdOnClick);
  const courseClickUserId = useSelector(state => state.courseClickUserId.courseClickUserId)
  const navigate=useNavigate();
  const [cookies, setCookie,removeCookies] = useCookies();
  const dispatch = useDispatch();
  const location = useLocation();
  const locationName=location.pathname;
  let newLocationName=""

  let counter=0;

  for (let i = 0;i<locationName.length;i++){
    if (locationName[i] === "/"){
      counter++;
    }
    if (counter > 1){
      // return
    } else {
      newLocationName+=locationName[i]
    }
  }

  const [sidebar, setSidebar] = useState(false);

  function showSidebar() {
    setSidebar(!sidebar);
  }

  function closeSidebar() {
    setSidebar(state => state = false);
  }

  // console.log(typeof(courseIdredux));

  if ((typeof(courseIdredux) === "number") && newLocationName !== "/courses"){
    dispatch(getCourseIdOnClickactions.getCourseIdOnClick({}))
  }

  const logout=(e)=>{
    e.preventDefault();
    dispatch(userActions.userInfo({}));
    removeCookies('token');
    navigate("/")
  }

  return (
    <>
      <div className="navbar">
        <i class="bi bi-list" onClick={showSidebar}></i>
        <div className="logocenter">
          <img src={image} alt="logo"></img>
        </div>
      </div>

    <div className="mainDiv">
      <nav className={sidebar ? 'nav-menu active1' : 'nav-menu'}>
        <ul className="nav-menu-items" >
          <div className="hr"></div>
          <li className="nav-text" title='Dashboard'>
            <Link onClick={() => setSidebar(false)}  className={(location.pathname === "/dashboard" || location.pathname === '/dashboard/createCourse') && sidebar === false ? "flexstartborder" : sidebar === true && location.pathname === "/dashboard" ? "flexcenterborder": sidebar ===true ? "flexstart" : "flexcenter"} to={'/dashboard'}>
              <i className="bi bi-menu-button-wide-fill"></i>
              { <span>DASHBOARD</span>}
            </Link>
          </li>

          <li className="nav-text" title='Courses'>
            <Link onClick={() => setSidebar(false)}  className={newLocationName === "/courses" && sidebar === false ? "flexstartborder" : sidebar === true && newLocationName === "/courses" ? "flexcenterborder": sidebar ===true ? "flexstart" : "flexcenter"} to={'/courses'}>
          <i class="bi bi-book"></i>
              { <span>COURSES</span>}
            </Link>
          </li>

          {typeof(courseIdredux) === "number" && (location.pathname === "/courses" || location.pathname === "/courses/pools" || location.pathname === "/courses/setting" || location.pathname === "/courses/content" || location.pathname === "/courses/quiz" || location.pathname === "/courses/assignment" || location.pathname === "/courses/editQuiz" || location.pathname === '/courses/poolQuestions' || location.pathname === '/courses/manangeStudents' || location.pathname === '/courses/poolQuestions') && 
          <div style={sidebar === true ? {padding:"0 10px"}:{padding:"0 10px"}} className={"subMenu"}>
            

            <li className="nav-text" title='Content'>
              <NavLink  onClick={() => setSidebar(false)} className={location.pathname === "/content" && sidebar === false ? "flexstartborder" : sidebar === true && location.pathname === "/courses/content" ? "flexcenterborder": sidebar ===true ? "flexstart" : "flexcenter"} to={'/courses/content'}>
                <i class="bi bi-card-heading"></i>
                { <span>Content</span>}
              </NavLink>
            </li>

            <li className="nav-text" title='Quizzes'>
              <NavLink onClick={() => setSidebar(false)} className={(location.pathname === "/courses/editQuiz" || location.pathname === '/courses/preview' || location.state === "/courses/displayQuiz" || location.state === "/courses/result" )&& sidebar === false ? "flexstartborder" : sidebar === true && location.pathname === "/courses/quiz" ? "flexcenterborder": sidebar ===true ? "flexstart" : "flexcenter"} to={'/courses/quiz'}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-video3" viewBox="0 0 16 16">
              <path d="M14 9.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm-6 5.7c0 .8.8.8.8.8h6.4s.8 0 .8-.8-.8-3.2-4-3.2-4 2.4-4 3.2Z"/>
              <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h5.243c.122-.326.295-.668.526-1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v7.81c.353.23.656.496.91.783.059-.187.09-.386.09-.593V4a2 2 0 0 0-2-2H2Z"/>
              </svg>
                {<span>Quizzes</span>}
              </NavLink>
            </li>

            {user.userInfo.user.id == courseClickUserId &&
            <li className="nav-text" title='Pools'>
              <NavLink onClick={() => setSidebar(false)} className={(location.pathname === "/pools" || location.pathname === '/courses/poolQuestions') && sidebar === false ? "flexstartborder" : sidebar === true && location.pathname === "/courses/pools" ? "flexcenterborder": sidebar ===true ? "flexstart" : "flexcenter"} to={'/courses/pools'}>
                <i class="bi bi-journal-text"></i>
                { <span>Pools</span>}
              </NavLink>
            </li>}

            <li className="nav-text" title='Assignment'>
              <NavLink onClick={() => setSidebar(false)} className={location.pathname === "/pools" && sidebar === false ? "flexstartborder" : sidebar === true && location.pathname === "/courses/assignment" ? "flexcenterborder": sidebar ===true ? "flexstart" : "flexcenter"} to={'/courses/assignment'}>
                <i class="bi bi-pencil-square"></i>
                { <span style={!sidebar ? {fontSize:'7px'}:{}}>Assignment</span>}
              </NavLink>
            </li>

            {user.userInfo.user.id === courseClickUserId &&
            <li className="nav-text" title='Setting'>
              <NavLink onClick={() => setSidebar(false)} className={(location.pathname === "/" || location.pathname === "/courses/manangeStudents") && sidebar === false ? "flexstartborder" : sidebar === true && location.pathname === "/courses/setting" ? "flexcenterborder": sidebar ===true ? "flexstart" : "flexcenter"} to={'/courses/setting'}>
                <i class="bi bi-gear"></i>
                { <span>Settings</span>}
              </NavLink>
            </li>}
          </div>}        

          <li className="nav-text" title='Alert'>
            <Link onClick={() => setSidebar(false)} className={location.pathname === "/notification" && sidebar === false ? "flexstartborder" : sidebar === true && location.pathname === "/notification" ? "flexcenterborder": sidebar ===true ? "flexstart" : "flexcenter"} to={'/notification'}>
              <i class="bi bi-exclamation-circle"></i>
              { <span>ALERT</span>}
            </Link>
          </li>
          <li className="nav-text" title='Profile'>
            <Link onClick={() => setSidebar(false)} className={location.pathname === "/profile" && sidebar === false ? "flexstartborder" : sidebar === true && location.pathname === "/profile" ? "flexcenterborder": sidebar ===true ? "flexstart" : "flexcenter"} to={'/profile'}>
              <i class="bi bi-person"></i>
              { <span>PROFILE</span>}
            </Link>
          </li>
          <li  className="nav-text" title='Logout'>
            <Link onClick={logout} className={location.pathname === "/" && sidebar === false ? "flexstartborder" : sidebar === true && location.pathname === "/" ? "flexcenterborder": sidebar ===true ? "flexstart" : "flexcenter"} to={'/'}>
              <i class="bi bi-box-arrow-left"></i>
              { <span>LOGOUT</span>}
            </Link>
          </li>
          <div className="hr1"></div>
        </ul>
      </nav>
      <main className='main' onClick={closeSidebar}>
        {props.children}
      </main>
    </div>
  </>
  );
}

export default Navbar2;
