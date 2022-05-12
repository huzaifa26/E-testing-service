import styles from "./Auth.module.css";
import Login from "../Components/Auth/Login";
import Signup from "../Components/Auth/Signup";
import { useState } from "react";

function Auth() {

    const [showSignup,setShowSignUp]=useState(false);
    const [showLogin,setShowLogin]=useState(true);

    const showLoginHandler=()=>{
        setShowLogin(false)
        setShowSignUp(true)
    }

    const setShowSignUpHanlder=()=>{
        setShowLogin(true)
        setShowSignUp(false)
    }

    return ( 
        <div className={styles.AuthContainer}>
            {
                showLogin && <Login showLoginHandler={showLoginHandler}/>
            }

            {
                showSignup && <Signup setShowSignUpHanlder={setShowSignUpHanlder}/>
            }
        </div>
     );
}

export default Auth;