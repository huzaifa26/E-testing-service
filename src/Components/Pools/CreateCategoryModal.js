import styles from "./CreateCategoryModal.module.css";
import {useSelector} from "react-redux";
import {useRef} from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

function CreateCategoryModal(props) {
    const navigate=useNavigate();
    const formRef=useRef();
    const courseId_name=useSelector(state=> state.courseId_Name.courseIdName);
    const user=useSelector(state=> state.user)


    const formSubmitHandler=(e)=>{
        e.preventDefault();
        let data={
            courseId:formRef.current.courseId.value,
            userId:user.userInfo.user.id,
            categoryName:formRef.current.categoryName.value,
        }
        console.log(data);

        axios.post("http://localhost:5000/api/poolCategory",data).then((res)=>{
            console.log(res);
            props.closeModalHandler();
        }).catch((err)=>{
            console.log(err)
        })
    }

    return (
        <>
            <div onClick={()=>{props.closeModalHandler()}} className={styles.CreateCategoryModalBackground}>
            </div>
            <div onClick={()=>{}} className={styles.CreateCategoryModal}>
                <form style={{width:'100%',height:'100%',display:'flex',flexDirection:'column'}}  ref={formRef} onSubmit={formSubmitHandler}>
                    <h2 style={{height:"15%",marginBottom:'15px',textAlign:"center",fontSize:'25px',color:'var(--primary)',fontWeight:"500" }}>Create Category</h2>
                    <select name="courseId">
                        <option disabled selected>Choose Course</option>
                        {courseId_name.map((value) => {
                            return <option value={value.id}>{value.courseName}</option>;
                        })}
                    </select>
                    <input type={"text"} name="categoryName" placeholder=" Category Name"></input>
                    <div className={styles.btnDiv}>
                        <button onClick={()=>{props.closeModalHandler()}}>Close</button>
                        <button type="submit">Submit</button>
                    </div>
                </form>

            </div>
      <ToastContainer autoClose={1000}/>
        </>
     );
}

export default CreateCategoryModal;  