import React, { useState,useEffect  } from 'react'
import { useSelector } from 'react-redux';
import styles from './PoolMain.module.css'
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateCategoryModal from '../Pools/CreateCategoryModal';
import { useNavigate } from 'react-router-dom';



function PoolMain() {
   const user=useSelector(state=> state.user)
   const courseIdredux=useSelector(state => state.getCourseIdOnClick.getCourseIdOnClick);
   const [poolCategory,setPoolCategory] = useState([])
   const [showModal,setShowModal]=useState(false);
   const navigate = useNavigate();

   useEffect(()=>{
    if(user.userInfo.hasOwnProperty("user") === true){
      let link='http://localhost:5000/api/getCourseCategories/' + courseIdredux;
      axios.get(link,{withCredentials:true}).then((res)=>{
        console.log(res.data.data)
        setPoolCategory(res.data.data);
      }).catch((err)=>{
        console.log(err);
      })
    }
    },[showModal])

    const openModalHandler=()=>{
        setShowModal(true);
      }
      const closeModalHandler=()=>{
        setShowModal(false);
      }

    const handleClick = (value) =>
    {
        navigate("/courses/poolQuestions", { state: {item:value}})
        console.log('ok')
    }

  return (
    <div className={styles.pool}>
        <div className={styles.intro}>
            <h1>Pools</h1>
            <p>
            Pool is a collection of questions that is stored for repeated use.
            </p>
        </div>
        <hr></hr>
        <div className={styles.poolBody}>
            <div className={styles.buttonContainer}>
                <button className={styles.addButton} onClick={openModalHandler} >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16" > <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" /> </svg>
                    Add Question Bank
                </button>
            </div>

            <div className={styles.poolCategories}>
            {poolCategory.map((value) => {
                     return <> 
                        <div className={styles.categoryName}>
                            <p className={styles.name} onClick={() => handleClick(value)}>{value.categoryName}</p>
                            <DeleteIcon style={{ color: '#E53472' }} />
                        </div>
                        <hr></hr>
                        </>;
                })}
            </div>

        </div>
        {showModal && <CreateCategoryModal closeModalHandler={closeModalHandler}></CreateCategoryModal>}
    </div>
  )
}

export default PoolMain