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

const  CreateCourse=(props) => {
    const dispatch=useDispatch();
    const user=useSelector(state=>{return state.user;})
    const [image , setImage] = useState('');
    const [imageURL , setImageURL] = useState('');
    const formRef=useRef();

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

        let data={
            userId:user.userInfo.user.id,
            imageUrl:imageURL,
            courseName:formRef.current.courseName.value,
            description:formRef.current.description.value,
            startDate:formRef.current.startDate.value,
            endDate:formRef.current.endDate.value,
            format:formRef.current.format.value,
            createTime:yourDate,
        }
        axios.post("http://localhost:5000/api/courses",data).then((res)=>{
            console.log(res.status);
            if(res.status === 200){
                // toast.success('Course Created Succesfully', {
                //     position: toast.POSITION.BOTTOM_RIGHT,
                // });
                axios.get("http://localhost:5000/api/courses").then((res)=>{
                    dispatch(courseActions.courses(res.data.data));
                  }).catch((err)=>{
                    console.log(err);
                  })
                props.showDashboardHandler();
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
            <h1>Create Course</h1>
        </div>

        <div className={styles.joinedHeader2}>
            <form ref={formRef} onSubmit={CreateClassSubmithandler} className={styles.form}>
                <input onChange={imageHandler} type="file" alt="Choose File" accept=".png,.jpg,.jpeg" width="48" height="48"></input>
                <input name="courseName" type={"text"} placeholder="Course Name"></input>
                <textarea name="description" rows='6' type={"text"} placeholder="Description"></textarea>

                <div>
                    <label>Start Time: <input name="startDate" type="date"></input></label>
                </div>
                <div>
                    <label>End Time: <input name="endDate" type="date"></input></label>
                </div>

                <select name="format">
                    <option defaultChecked>Choose Format</option>
                    <option>On-Campus</option>
                    <option>Online</option>
                </select>
                <div className={styles.button}>
                <button type="submit">Create Class</button>
                </div>
            </form>
        </div>
    </div> );
}

export default CreateCourse;