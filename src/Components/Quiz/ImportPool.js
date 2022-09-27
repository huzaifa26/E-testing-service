import React, { useState,useEffect  } from 'react'
import { useSelector } from 'react-redux';
import styles from './ImportPool.module.css'
import axios from 'axios';

function ImportPool({close,getQuestion}) {

   const user=useSelector(state=> state.user)
   const courseIdredux=useSelector(state => state.getCourseIdOnClick.getCourseIdOnClick);

   const [poolCategory,setPoolCategory] = useState([])
   const [poolQuestion,setPoolQuestions]  = useState([])
   const [matchQuestions,setMatchQuestions] = useState(0)
   let [checked, setChecked] = useState([{id:0,question:'okokokokokok'}]);

   var checkedItems = checked.length
    ? checked.reduce((total, item) => {
        return total + ", " + item;
      })
    : "";


   useEffect(()=>{
    if(user.userInfo.hasOwnProperty("user") === true){
      let link='http://localhost:5000/api/getCourseCategories/' + courseIdredux;
      axios.get(link,{withCredentials:true}).then((res)=>{
        // console.log(res.data.data)
        setPoolCategory(res.data.data);
      }).catch((err)=>{
        console.log(err);
      })
    }
    
    if(user.userInfo.hasOwnProperty("user") === true){
        axios.get("http://localhost:5000/api/poolQuestions2/" + user.userInfo.user.id+"/"+courseIdredux,{withCredentials:true}).then((res)=>{
        console.log(res.data)
        setPoolQuestions(res.data);
        }).catch((err)=>{
        console.log(err);
        })
    }
    
  },[close])

  const handlePoolCategory = (event) =>
  {
    setMatchQuestions(event.id);
  }


  const handleCheck = (item) => {
    // console.log(letmecheck(item.id))
    var hehe = checked.some(items => items.id == item.id)
    console.log(hehe)
    if(!hehe)
    {
      let newfield = { 
        id: item.id,
        correctOption: item.correctOption,
        courseId: item.courseId,
        courseName: item.courseName,
        isMathjax: item.isMathjax,
        options: item.options,
        poolCategoryId: item.poolCategoryId,
        question: item.question,
        questionImage: item.questionImage,
        questionType: item.questionType,
        time:item.time,
        points:item.points,
        userId: item.userId };
      setChecked([...checked,newfield])
    }
    else
    {
      console.log('i ran')
      const newArr = checked.filter(object => {
        return object.id !== item.id;
      });;
      checked.splice(0, checked.length, ...newArr);
      console.log(checked)
    }
  };

  const add = () =>
  {
      checked.shift(); 
      getQuestion(checked)
      close(false)
  }
  return (
    <>
        <div className={styles.modalBackground}  onClick={() => close(false)}></div>
        <div className={styles.modalContainer}>
            <div className={styles.header}>
            <p>Find Questions</p>
            <i class="bi bi-x-circle" onClick={() => close(false)}></i>
            </div>
            <hr></hr>

            <div className={styles.body}>
                <div className={styles.left}>
                {poolCategory.map((value) => {
                     return <div className={matchQuestions == value.id ? styles.selected : styles.categoryName} onClick={() =>handlePoolCategory(value) }>
                        <p  className={styles.first}>{value.categoryName}</p>
                        <p className={styles.second}>{value.courseName}</p>
                        </div>;
                })}

                </div>
                <hr></hr>
                <div className={styles.right}>
                  <div className={styles.header2}>
                    {poolQuestion.filter((data) => {return +data.poolCategoryId === matchQuestions}).map((item,index) => 
                    (
                      <div className={styles.question} key={index} >
                        <div className={styles.questionHeader}>
                       
                          <input value={item} type="checkbox" checked={checked.some(items => items.id == item.id) ? true:false}  onChange={() => handleCheck(item)} />
                          <p>{item.question}</p>              
                        </div>
                        <div className={styles.questionFooter}>
                          <p>{item.questionType}</p>
                        </div>

                      </div>
                    ))}
                    </div>

                    
                </div>
            </div>
            
            <div className={styles.footer}>
                    {matchQuestions !== "" && <button onClick={add}>Add</button>} 
            </div>
            <div>
  {`Items checked are: ${checkedItems}`}
</div>
        </div>
    </>
  )
}

export default ImportPool