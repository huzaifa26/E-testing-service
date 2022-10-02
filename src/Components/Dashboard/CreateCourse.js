import styles from "./CreateCourse.module.css";
import {useRef} from "react";
import axios from "axios";
import {Storage} from "../Utils/firebase";
import {useState} from "react";
import {ref,uploadBytes,getDownloadURL} from "firebase/storage"
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import {courseActions} from "./../../Redux/course-slice";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';


const  CreateCourse=(props) => {
    const user=useSelector(state=>{return state.user;})
    const [cookie,setCookie]=useCookies();
    const [image , setImage] = useState('');
    const [imageURL , setImageURL] = useState('https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/cb/3c4030d65011e682d8b14e2f0915fa/shutterstock_226881610.jpg?auto=format%2Ccompress&dpr=1');
    const formRef=useRef();
    const navigate = useNavigate()

const CreateClassSubmithandler=(e)=>{
    e.preventDefault();

    function getTime() {
        var date = new Date()
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        return date.toISOString();
    }
    let yourDate=getTime();
    yourDate=yourDate.toString().split("T");
    yourDate[1]=yourDate[1].toString().split(".")[0];
    yourDate=yourDate.toString().replaceAll(","," ");

    console.log(user);

    let data={
        userId:user.userInfo.user.id,
        imageUrl:imageURL,
        courseName:formRef.current.courseName.value,
        description:formRef.current.description.value,
        createTime:yourDate,
    }
    axios.post("http://localhost:5000/api/courses",data,{withCredentials:true}).then((res)=>{
        console.log(res);
        if(res.status === 200){
            toast.success('Course Created Succesfully', {
                position: toast.POSITION.TOP_RIGHT,
            });
            navigate('/dashboard')
        }
    }).catch((err)=>{
        if(err.status === 500){
            toast.error('Cannot register Course', {
                position: toast.POSITION.TOP_RIGHT,
            });
        } 
    })
}

    // UPLOAD COURSE IMAGES TO FIREBASE
    const imageHandler= async (e)=>{
        setImage(e.target.files[0]);
        console.log(e.target.files);
        
        if(image == null)
            return;

        const storageRef = ref(Storage, `/courseImages/${e.target.files[0].name}`);
        const uploadTask = await uploadBytes(storageRef, e.target.files[0]);
        
        getDownloadURL(ref(Storage, `/courseImages/${e.target.files[0].name}`)).then((url) => {
            console.log(url);
            setImageURL(url);
        });
    }

    return ( 
    <div className={styles.CreateCourse}>
        <div className={styles.joinedHeader1}>
            <h1>Create Class</h1>
        </div>

        <div className={styles.joinedHeader2}>
            <form ref={formRef} onSubmit={CreateClassSubmithandler} className={styles.form}>
            <div className={styles.imageContainer}>
                <div className={styles.joinss}>
                <img src={imageURL===""?"https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/cb/3c4030d65011e682d8b14e2f0915fa/shutterstock_226881610.jpg?auto=format%2Ccompress&dpr=1":imageURL}></img>
                <div style={{marginLeft:'6.541vw',marginTop:'10px'}}>
                <label for="files" class="btn">Change Image</label>
                <input required accept=".png,.jpg,.jpeg" onChange={imageHandler} id="files" style={{visibility:"hidden"}} type="file"/>
                </div>
                </div>

            </div>
                {/* <input required name="courseName"  placeholder="Class Name"></input> */}
                <TextField name="courseName" type={"text"} id="outlined-basic" label="Class Name" variant="outlined" sx={{ width:'320px' }} size="medium"  required />

                <textarea required style={{resize: 'none',minWidth:'320px',width:'40%',fontSize:'18px',borderRadius:"4px",padding:'10px'}}  name="description" rows='10' type={"text"} placeholder="Description"></textarea>

                <div className={styles.button}>
                <button type="submit">Create Class</button>
                </div>
            </form>
        </div>
    </div> );
}

export default CreateCourse;