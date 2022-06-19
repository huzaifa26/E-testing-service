import './Navbar.css';
import image from '../../Assets/logo.png';
import React, { useState } from 'react';
import { Link,useLocation,useNavigate } from 'react-router-dom';

const Navbar2= (props) => {
  const navigate=useNavigate();
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
            <Link onClick={()=>{if (location.pathname === "/dashboard") {navigate(1)}console.log("hahaha") }} className={location.pathname === "/dashboard" && sidebar === false ? "flexstartborder" : sidebar === true && location.pathname === "/dashboard" ? "flexcenterborder": sidebar ===true ? "flexstart" : "flexcenter"} to={'/dashboard'}>
              <i className="bi bi-menu-button-wide-fill"></i>
              {sidebar && <span>Dashboard</span>}
            </Link>
          </li>



          <li className="nav-text">
            <Link className={newLocationName === "/courses" && sidebar === false ? "flexstartborder" : sidebar === true && newLocationName === "/courses" ? "flexcenterborder": sidebar ===true ? "flexstart" : "flexcenter"} to={'/courses'}>
              <i class="bi bi-exclamation-circle"></i>
              {sidebar && <span>Courses</span>}
            </Link>
          </li>

          {(location.pathname === "/courses" || location.pathname === "/courses/pools" || location.pathname === "/courses/setting") && 
          <div style={sidebar === true ? {padding:"0 10px"}:{padding:"0 10px"}} className={"subMenu"}>
            <li className="nav-text">
              <Link className={location.pathname === "/pools" && sidebar === false ? "flexstartborder" : sidebar === true && location.pathname === "/pools" ? "flexcenterborder": sidebar ===true ? "flexstart" : "flexcenter"} to={'/courses/pools'}>
                <i class="bi bi-book"></i>
                {sidebar && <span>Pools</span>}
              </Link>
            </li>
            <li className="nav-text">
              <Link className={location.pathname === "/" && sidebar === false ? "flexstartborder" : sidebar === true && location.pathname === "/" ? "flexcenterborder": sidebar ===true ? "flexstart" : "flexcenter"} to={'/'}>
                <i class="bi bi-box-arrow-left"></i>
                {sidebar && <span>Pools</span>}
              </Link>
            </li>
            <li className="nav-text">
              <Link className={location.pathname === "/" && sidebar === false ? "flexstartborder" : sidebar === true && location.pathname === "/" ? "flexcenterborder": sidebar ===true ? "flexstart" : "flexcenter"} to={'/'}>
                <i class="bi bi-box-arrow-left"></i>
                {sidebar && <span>Pools</span>}
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
            <Link className={location.pathname === "/" && sidebar === false ? "flexstartborder" : sidebar === true && location.pathname === "/" ? "flexcenterborder": sidebar ===true ? "flexstart" : "flexcenter"} to={'/'}>
              <i class="bi bi-box-arrow-left"></i>
              {sidebar && <span>Logout</span>}
            </Link>
          </li>
          <div className="hr1"></div>
        </ul>
      </nav>
      <main className='main'>
        {props.children}
      </main>
    </div>
  </>
  );
}

export default Navbar2;
