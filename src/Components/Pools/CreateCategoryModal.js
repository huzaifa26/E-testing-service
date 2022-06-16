import styles from "./CreateCategoryModal.module.css";
import {useSelector} from "react-redux";
import {useRef} from "react";
import axios from "axios";

function CreateCategoryModal(props) {
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
        }).catch((err)=>{
            console.log(err)
        })
    }

    return (
        <>
            <div onClick={()=>{props.closeModalHandler()}} className={styles.CreateCategoryModalBackground}>
            </div>

            <div onClick={()=>{}} className={styles.CreateCategoryModal}>
                <h2>Create Category</h2>
                <form ref={formRef} onSubmit={formSubmitHandler}>
                    <select name="courseId">
                        <option disabled selected>Choose Course</option>
                        {courseId_name.map((value) => {
                            return <option value={value.id}>{value.courseName}</option>;
                        })}
                    </select>
                    <input type={"text"} name="categoryName" placeholder="Category Name"></input>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </>
     );
}

export default CreateCategoryModal;  