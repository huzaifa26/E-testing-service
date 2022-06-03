import './Navbar.css';
import image from '../../Assets/logo2.png';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar2(props) {
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
          {/* <li className="navbar-toggle-first">
          </li>
           */}
          <div className="hr"></div>
          <li className="nav-text">
            <Link to={'/dashboard'}>
              <i class="bi bi-menu-button-wide-fill"></i>
              <span>Dashboard</span>
            </Link>
          </li>
          <li className="nav-text">
            <Link to={'/courses'}>
              <i class="bi bi-book-half"></i>
              <span>Courses</span>
            </Link>
          </li>
          <li className="nav-text">
            <Link to={'/pools'}>
              <i class="bi bi-question-circle"></i>
              <span>Pools</span>
            </Link>
          </li>
          <li className="nav-text">
            <Link to={'/notification'}>
              <i class="bi bi-exclamation-octagon"></i>
              <span>Notifications</span>
            </Link>
          </li>
          <li className="nav-text">
            <Link to={'/'}>
              <i class="bi bi-box-arrow-left"></i>
              <span>Logout</span>
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
