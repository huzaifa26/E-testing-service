import styles from "./Login.module.css";
import { useEffect, useRef } from "react";
import axios from "axios";

function Login(props) {
  const loginData = useRef();

  const loginSubmitHandler = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:5000/api/login", {
        email: loginData.current.email.value,
        password: loginData.current.password.value,
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const signUpHandler = () => {
    props.showLoginHandler();
  };

  return (
    <div className={styles.LoginContainer}>
      <h1>Login</h1>
      <form ref={loginData} onSubmit={loginSubmitHandler}>
        <input type="email" name="email" placeholder="Email"></input>
        <input type="password" name="password" placeholder="Password"></input>
        <button type="submit">Login</button>
      </form>
      <div>
        <p>
          Need an Account? <span onClick={signUpHandler}>SIGN UP</span>
        </p>
        <p>
          <span>English</span>|<span>Urdu</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
