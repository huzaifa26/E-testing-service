import styles from "./Signup.module.css";
import {useRef} from "react";
import axios from "axios";
import emailjs from '@emailjs/browser';

export const MailService = async (data) => {
    data.link="http://localhost:3000/emailVerification/"+data.id;

    emailjs.send('service_gvyqi7g', 'template_ojllmfn', data , 'PCrkZDdTgRVPTxMHf')
    .then((result) => {
        console.log(result.text);
    }, (error) => {
        console.log(error.text);
    });
}

function Signup(props) {
    const signupData=useRef();

    const signupSubmitHandler=async (e)=>{
        e.preventDefault();

        if(signupData.current.password.value !== signupData.current.confirmPassword.value){
            return
        }

        axios.post("http://localhost:5000/api/signup",{
            fullName:signupData.current.fullName.value,
            email:signupData.current.email.value,
            password:signupData.current.password.value,
            confirmPassword:signupData.current.confirmPassword.value
        }).then(function (response) {
            if(response.status === 200){
                console.log(response);
                MailService(response.data);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    const loginHanlder=()=>{
        props.setShowSignUpHanlder()
    }

    return ( 
        <div className={styles.SignupContainer}>
            <h1>SIGN UP</h1>
            <form ref={signupData} onSubmit={signupSubmitHandler}>
                <input required type="text" name="fullName" placeholder="Full Name"></input>
                <input required type="email" name="email" placeholder="Email"></input>
                <input required type="password" name="password" placeholder="Password"></input>
                <input required type="password" name="confirmPassword" placeholder="Confirm Password"></input>
                <button type="submit">SIGN UP</button>
            </form>
            <div>
                <p>Already Have Account? <span onClick={loginHanlder}>LOGIN</span></p>
                <p><span>English</span>|<span>Urdu</span></p>
            </div>
        </div>
     );
}

export default Signup;