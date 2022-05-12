import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";



function EmailVerification(props) {

    let { id } = useParams();
    console.log(id);

    const navigate = useNavigate();


    const verifyEmailHandler=()=>{
        axios.post("http://localhost:5000/api/verifyEmail",{id})
        .then(function (response) {
            if (response.status === 200){
                navigate('/');
                console.log("Verified success");
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    return ( 
        <div>
            <p>Click Button to verify your email.</p>
            <button onClick={verifyEmailHandler}>Verify Email</button>
        </div>
     );
}

export default EmailVerification;