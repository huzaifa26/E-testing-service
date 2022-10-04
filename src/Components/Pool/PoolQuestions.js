import React from 'react'
import styles from './PoolQuestions.module.css'
import { useLocation,useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { useState,useEffect  } from 'react'
import { MathComponent } from 'mathjax-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import CreateQuestion from '../Quiz/CreateQuestion';
import { useCookies } from 'react-cookie';
import EditPool from './EditPool';

function PoolQuestions() {
  const location = useLocation();
  const [cookie]=useCookies();
//   const navigate = useNavigate();
  const user=useSelector(state=> state.user)
  const courseIdredux=useSelector(state => state.getCourseIdOnClick.getCourseIdOnClick);
  const [triggerDelete,setTriggerDelete] = useState(false)
  const [poolQuestion,setPoolQuestions]  = useState([])
  const [add, setAdd] = useState(false);
  const [time,setTime] = useState(30)
  const [editDetail,setEditDetail] = useState({})


  useEffect(() => {
    if(user.userInfo.hasOwnProperty("user") === true){
        axios.get("http://localhost:5000/api/poolQuestions2/" + user.userInfo.user.id+"/"+courseIdredux,{withCredentials:true}).then((res)=>{
        setPoolQuestions(res.data);
        }).catch((err)=>{
        console.log(err);
        })
    }
    
  }, [triggerDelete])

  const deleteQuestionHanler=(id)=>{
    console.log(id)
    let data={id:id}
    if(user.userInfo.hasOwnProperty("user") === true){
      axios.post("http://localhost:5000/api/deletepoolQuestions",data,{withCredentials:true}).then((res)=>{
      setTriggerDelete((state) => !state)
      toast.success('Question Deleted', {
          position: toast.POSITION.TOP_RIGHT,
      })
      }).catch((err)=>{
        toast.error('Question Deletion Failed', {
          position: toast.POSITION.TOP_RIGHT,
        })
      })
    }
  }

  const getQuestion = (question) => {
    question.courseName = location.state.item.courseName
    question.poolCategory = location.state.item.id
  
    let url="http://localhost:5000/api/poolQuestions/";
      axios.post(url,question,{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}).then((res)=>{
        console.log(res)
        if(res.status === 200)
        {
            toast.success('Added', {
              position: toast.POSITION.TOP_CENTER,
            });
            setTriggerDelete((state) => !state)
        }
      }).catch((err)=>{
        console.log(err)
        toast.error('Failed', {
          position: toast.POSITION.TOP_CENTER,
        });
      })

  }

  const handleAdd = () => 
  {
    window.scroll({
        top: document.body.offsetHeight,
        left: 0, 
        behavior: 'smooth',
      });
 
    setAdd(true)
  }
  
  const handleEdit = (item) =>
  {
    setEditDetail(item)
  }

  const editData = (question) =>
  {
    question.courseName = location.state.item.courseName
    question.poolCategoryId = location.state.item.id
    console.log(question)
    let url="http://localhost:5000/api/editQuestionToPool/";
    axios.post(url,question,{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}).then((res)=>{
        console.log(res)
        if(res.status === 200)
        {
        toast.success('Edited', {
        position: toast.POSITION.TOP_CENTER,
        });}
      setTriggerDelete((state) => !state)
      close()
    }).catch((err)=>{
        console.log("err")
        toast.error('Failed', {
        position: toast.POSITION.TOP_CENTER,
        });
    })

    console.log(question)
  }

  const close = ()=>
  {
    setEditDetail([])
  }

  return (
    <div className={styles.Main}>
      <div className={styles.Main2}>

        <div className={styles.left}>
        {poolQuestion.filter((data) => {return +data.poolCategoryId === location.state.item.id}).map((item,index) => {
        return (editDetail?.id === item.id) ? 
        <EditPool editData={editData} editDetail={item} close={close}/>
        :
        <div className={styles.questions}>
            <div className={styles.head}>
              <div>Points : {item.points}  </div>
              <div>Sec : {item.time}</div>
            </div>
            <div className={styles.body}>
            <div style={{display:'flex',flexDirection:'column',justifyContent:'center'}}>

            {(item.questionImage !== null ) &&
          <div>
            <img src={item.questionImage} style={{height:'150px',marginBottom:'5px'}} alt="Question Image"/>
          </div>}

              {item.questionType === 'Formula' ? <div style={{display:"flex",justifyContent:'flex-start'}}><MathComponent  tex={item.question} /></div>
          : <b>{item.question}</b>}
          </div>

              <div className={styles.footer1}>
                <button className={styles.edit} onClick={(e) => handleEdit(item)}>Edit</button>
                <button className={styles.button0} onClick={(e)=>{deleteQuestionHanler(item.id)}} >Delete</button>
            </div>
            </div>
        </div>
        
        })}
        {add && <CreateQuestion close={setAdd} time={time}  getQuestion={getQuestion}/>}
        </div>

        <div className={styles.buttonContainer}>
                <button className={styles.addButton} onClick={handleAdd}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16" > <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" /> </svg>
                    Add a Question 
                </button>
        </div>
    </div>
    </div>

  )
}

export default PoolQuestions