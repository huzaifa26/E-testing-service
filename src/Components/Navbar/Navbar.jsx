import './Navbar.css';
import image from '../../Assets/logo.png';
import React, { useState } from 'react';
import { Link,useLocation,useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { userActions } from './../../Redux/user-slice'; 
import { courseActions,courseCategoriesActions,getCourseIdOnClickactions,courseId_NameActions } from './../../Redux/course-slice';

const Navbar2= (props) => {
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
    // setSidebar(state => state = false);
  }

  const courseIdredux=useSelector(state => state.getCourseIdOnClick.getCourseIdOnClick);
  // console.log(typeof(courseIdredux));

  if ((typeof(courseIdredux) === "number") && newLocationName !== "/courses"){
    dispatch(getCourseIdOnClickactions.getCourseIdOnClick({}))
  }

  const logout=(e)=>{
    e.preventDefault();
    dispatch(userActions.userInfo({}));
    // dispatch(courseCategoriesActions.courseCategories([]));
    // dispatch(courseActions.courses([]))
    // dispatch(courseId_NameActions.courseIdName([]));

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
      <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
        <ul className="nav-menu-items" >
          <div className="hr"></div>
          <li className="nav-text">
            <Link className={location.pathname === "/dashboard" && sidebar === false ? "flexstartborder" : sidebar === true && location.pathname === "/dashboard" ? "flexcenterborder": sidebar ===true ? "flexstart" : "flexcenter"} to={'/dashboard'}>
              <i className="bi bi-menu-button-wide-fill"></i>
              {sidebar && <span>Dashboard</span>}
            </Link>
          </li>

          <li className="nav-text">
            <Link className={newLocationName === "/courses" && sidebar === false ? "flexstartborder" : sidebar === true && newLocationName === "/courses" ? "flexcenterborder": sidebar ===true ? "flexstart" : "flexcenter"} to={'/courses'}>
          <i class="bi bi-book"></i>
              {sidebar && <span>Courses</span>}
            </Link>
          </li>

          {typeof(courseIdredux) === "number" && (location.pathname === "/courses" || location.pathname === "/courses/pools" || location.pathname === "/courses/setting" || location.pathname === "/courses/content" || location.pathname === "/courses/quiz" || location.pathname === "/courses/assignment") && 
          <div style={sidebar === true ? {padding:"0 10px"}:{padding:"0 10px"}} className={"subMenu"}>
            
            <li className="nav-text nav-text-inner">
              <Link className={location.pathname === "/content" && sidebar === false ? "flexstartborder" : sidebar === true && location.pathname === "/pools" ? "flexcenterborder": sidebar ===true ? "flexstart" : "flexcenter"} to={'/courses/content'}>
                <i class="bi bi-card-heading"></i>
                {sidebar && <span>Content</span>}
              </Link>
            </li>

            <li className="nav-text nav-text-inner">
              <Link className={location.pathname === "/pools" && sidebar === false ? "flexstartborder" : sidebar === true && location.pathname === "/pools" ? "flexcenterborder": sidebar ===true ? "flexstart" : "flexcenter"} to={'/courses/quiz'}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-video3" viewBox="0 0 16 16">
              <path d="M14 9.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm-6 5.7c0 .8.8.8.8.8h6.4s.8 0 .8-.8-.8-3.2-4-3.2-4 2.4-4 3.2Z"/>
              <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h5.243c.122-.326.295-.668.526-1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v7.81c.353.23.656.496.91.783.059-.187.09-.386.09-.593V4a2 2 0 0 0-2-2H2Z"/>
              </svg>
                {sidebar && <span>Quizzes</span>}
              </Link>
            </li>


            <li className="nav-text nav-text-inner">
              <Link className={location.pathname === "/pools" && sidebar === false ? "flexstartborder" : sidebar === true && location.pathname === "/pools" ? "flexcenterborder": sidebar ===true ? "flexstart" : "flexcenter"} to={'/courses/pools'}>
                <i class="bi bi-journal-text"></i>
                {sidebar && <span>Pools</span>}
              </Link>
            </li>

            <li className="nav-text nav-text-inner">
              <Link className={location.pathname === "/pools" && sidebar === false ? "flexstartborder" : sidebar === true && location.pathname === "/pools" ? "flexcenterborder": sidebar ===true ? "flexstart" : "flexcenter"} to={'/courses/assignment'}>
                <i class="bi bi-pencil-square"></i>
                {sidebar && <span>Assignments</span>}
              </Link>
            </li>

            <li className="nav-text nav-text-inner">
              <Link className={location.pathname === "/" && sidebar === false ? "flexstartborder" : sidebar === true && location.pathname === "/pools" ? "flexcenterborder": sidebar ===true ? "flexstart" : "flexcenter"} to={'/assignment'}>
                <i class="bi bi-gear"></i>
                {sidebar && <span>Settings</span>}
              </Link>
            </li>
          </div>}        

          <li className="nav-text">
            <Link className={location.pathname === "/notification" && sidebar === false ? "flexstartborder" : sidebar === true && location.pathname === "/notification" ? "flexcenterborder": sidebar ===true ? "flexstart" : "flexcenter"} to={'/notification'}>
              <i class="bi bi-exclamation-circle"></i>
              {sidebar && <span>Notifications</span>}
            </Link>
          </li>
          <li className="nav-text">
            <Link className={location.pathname === "/profile" && sidebar === false ? "flexstartborder" : sidebar === true && location.pathname === "/profile" ? "flexcenterborder": sidebar ===true ? "flexstart" : "flexcenter"} to={'/profile'}>
              <i class="bi bi-person"></i>
              {sidebar && <span>Profile</span>}
            </Link>
          </li>
          <li  className="nav-text">
            <Link onClick={logout} className={location.pathname === "/" && sidebar === false ? "flexstartborder" : sidebar === true && location.pathname === "/" ? "flexcenterborder": sidebar ===true ? "flexstart" : "flexcenter"} to={'/'}>
              <i class="bi bi-box-arrow-left"></i>
              {sidebar && <span>Logout</span>}
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
