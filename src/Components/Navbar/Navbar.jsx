import './Navbar.css';
import image from '../../Assets/logo2.png';
import { useLocation } from "react-router-dom"


import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar2= (props) => {
  const location = useLocation();
  console.log(location.pathname);

  const [sidebar, setSidebar] = useState(false);

  function showSidebar() {
    setSidebar(!sidebar);
  }

  let classes="flexstart";

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
          <li  className="nav-text">
            <Link className={location.pathname === "/dashboard" && sidebar === false ? "flexstartborder" : sidebar === true && location.pathname === "/dashboard" ? "flexcenterborder": sidebar ===true ? "flexstart" : "flexcenter"} to={'/dashboard'}>
              <i className="bi bi-menu-button-wide-fill"></i>
              {sidebar && <span>Dashboard</span>}
            </Link>
          </li>
          {location.pathname === "/dashboard" && 
          <div style={sidebar === true ? {padding:"0 10px"}:{padding:"0 10px"}} className={"subMenu"}>
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
            <li className="nav-text">
              <Link className={location.pathname === "/" && sidebar === false ? "flexstartborder" : sidebar === true && location.pathname === "/" ? "flexcenterborder": sidebar ===true ? "flexstart" : "flexcenter"} to={'/'}>
                <i class="bi bi-box-arrow-left"></i>
                {sidebar && <span>Pools</span>}
              </Link>
            </li>
          </div>}

          <li className="nav-text">
            <Link className={location.pathname === "/pools" && sidebar === false ? "flexstartborder" : sidebar === true && location.pathname === "/pools" ? "flexcenterborder": sidebar ===true ? "flexstart" : "flexcenter"} to={'/pools'}>
              <i class="bi bi-book"></i>
              {sidebar && <span>Pools</span>}
            </Link>
          </li>
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
