import React, { useState,useRef, useEffect } from 'react'
import styles from './Editpool.module.css'
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {  EditorState, convertFromHTML, ContentState,convertToRaw } from 'draft-js';
import {ref,uploadBytes,getDownloadURL} from "firebase/storage";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useCookies } from 'react-cookie';


function Editpool(props) {
  const [cookie]=useCookies();


  //FOR EDITOR
  const [isMathJax,setIsMathjax]=useState(false);
  const blocksFromHTML = convertFromHTML(props.dataEdit1.question)
  const contentState = ContentState.createFromBlockArray(blocksFromHTML)
  const [editorState, setEditorState] = useState(EditorState.createWithContent(contentState));
  let question = convertToRaw(editorState.getCurrentContent());
  const rtQuestionRef = useRef('');
  const [image,setImage]=useState();
  const [imageURL , setImageURL] = useState('');
  const uploadCallback = (file, callback) => {
    return new Promise((resolve, reject) => {
      const reader = new window.FileReader();
      reader.onloadend = async () => {
        // const form_data = new FormData();
        // form_data.append("file", file);
        console.log(file)
        const storageRef = ref(Storage, `/questionPictures/${file.name}`);
        const uploadTask = await uploadBytes(storageRef, file);
        getDownloadURL(ref(Storage, `/questionPictures/${file.name}`)).then((url) => {
            console.log(url);
            setImageURL(url);
        });
        // setValue("thumbnail", res.data);
        resolve({ data: { link: "Uploaded"} });
      };
      reader.readAsDataURL(file);
    });
  };
  const config={
    image: { uploadCallback: uploadCallback },
  };


  //TO CHECK IF MCQ,SUBJECTIVE,TRUE/FALSE
  const [mcq,setMcq] = useState(false)
  const [subjective,setSubjective] = useState(false)
  const [True,setTrue] = useState(false)
  
  useEffect(() =>
  {
    if(props.dataEdit1.questionType === 'TRUE/FALSE')
    {
      setTrue(true)
      setMcq(false)
      setSubjective(false)
    }
    if(props.dataEdit1.questionType === 'Subjective')
    {
      setSubjective(true)
      setMcq(false)
      setTrue(false)
    }
    if(props.dataEdit1.questionType === 'Mcq')
    {
      setMcq(true)
      setSubjective(false)
      setTrue(false)
    }
  })

  //For TRUE
  const [value, setvalue] = useState(props.dataEdit1.correctOption);
  const handleTrues = () => {
    let truesData = {
      id:props.dataEdit1.id,
      options: props.dataEdit1.correctOption,
      correctOption: value,
      questionType: 'Subjective',
      question : question.blocks[0].text,
      isMathJax:isMathJax,
      courseId:props.dataEdit1.courseId,
      courseName:props.dataEdit1.courseName,
      poolCategoryId:props.dataEdit1.poolCategoryId,
      userId:props.dataEdit1.userId
    };

    if (imageURL !== ""){
      truesData.questionImg=imageURL;
    }

    console.log(truesData)

    let url="http://localhost:5000/api/editQuestionToPool/";
      axios.post(url,truesData,{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}).then((res)=>{
        console.log("res")
        toast.success('Added', {
          position: toast.POSITION.TOP_CENTER,
        });
        props.changeView();
      }).catch((err)=>{
        console.log("err")
        toast.error('Failed', {
          position: toast.POSITION.TOP_CENTER,
        });
      })
  };

  //FOR SUBJECTIVE
  const subjectiveAnswerRef = useRef('');
  const inputSubjectiveAnswerRef=useRef('');
  const [editorState2, setEditorState2] = useState(EditorState.createEmpty());
  const [showRichText,setShowRichText]=useState(false);
  const handlePlain = () => {

    let subjectiveQuestion = {
      questionType: 'Subjective',
      correctOption: inputSubjectiveAnswerRef.current.value,
      id:props.dataEdit1.id,
      options: ['True', 'False'],
      correctOption: value,
      questionType: 'TRUE/FALSE',
      question : question.blocks[0].text,
      isMathJax:isMathJax,
      courseId:props.dataEdit1.courseId,
      courseName:props.dataEdit1.courseName,
      poolCategoryId:props.dataEdit1.poolCategoryId,
      userId:props.dataEdit1.userId
    };
    console.log(subjectiveQuestion);
  

  if (imageURL !== ""){
    subjectiveQuestion.questionImg=imageURL;
  }
  }
  const changeInputHandler = (e) => {
    console.log(e.target.value);
    if (e.target.value === "Input"){
      setShowRichText(false);
    } else if (e.target.value === "Rich box"){
      setShowRichText(true);
    }
  }

  
  return (
    <>
    <div className={styles.modalBackground}></div>
    <div className={styles.modalContainer}>
      <i class="bi bi-x-circle" onClick={() => props.closeModal(false)}></i>
        {/* <p>{props.dataEdit1.id}</p>
        <p>{props.dataEdit1.courseId}</p>
        <p>{props.dataEdit1.courseName}</p>
        <p>{props.dataEdit1.question}</p>
        <p>{'HERE'+props.dataEdit1.questionImage}</p>
        <p>{props.dataEdit1.questionType}</p>
        <p>{props.dataEdit1.userId}</p> */}
        <div className={styles.true}>
              <label>Use MathJax:  
                <input type="checkbox" name="isTrue" value="true"
                  onClick={(e) => {
                    setIsMathjax(!isMathJax);
                  }}
                />
              </label>
        </div>
        {
          isMathJax && 
          <p style={{fontSize:"14px",margin:"4px 0"}}>Use ~ instead of space.</p>
        }
        <Editor
              toolbar={config}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              ref={rtQuestionRef}
              editorState={editorState}
              onEditorStateChange={(newState) => {
                setEditorState(newState);
              }}
              wrapperStyle={{
                width: '70%',
                marginBottom:'10px',
                border:'1px solid #DAEAF1',
                minHeight:"300px",
                minWidth:"315px",
                maxHeight: '300px',
                overflowX:"hidden",
                // overflowY:"auto"
              }}
            />
        {True && <>
          <div className={styles.true}>
            <label>True 
              <input defaultChecked={props.dataEdit1.correctOption === 'true'} type="radio" name="isTrue" value="true"
                onClick={(e) => {
                  setvalue(e.target.value);
                }}
              />
            </label>
            <label>False 
              <input defaultChecked={props.dataEdit1.correctOption === 'false'}type="radio" name="isTrue" value="false"
                onClick={(e) => {
                  setvalue(e.target.value);
                }}
              />
            </label>
          </div>
          <div className={styles.buttoncenter}>
            <button className={styles.button} onClick={handleTrues}>
                UPDATE
            </button>
          </div>
        </>}

        {subjective && 
         <div className={styles.plainMain}>
         <div className={styles.radioDiv}>
               <input onChange={changeInputHandler}  defaultChecked type="radio" id="input" name="subjectiveInput" value="Input"/>
               <label htmlFor="input">Input</label>
               <input onChange={changeInputHandler} type="radio" id="input" name="subjectiveInput" value="Rich box"/>
               <label htmlFor="input">Rich Text</label>
         </div>
         <h1>Answer</h1>
         <div className={styles.editor}>
 
         {showRichText === false && 
             <textarea ref={inputSubjectiveAnswerRef} rows={11} style={{width: "100%",resize:"none",minWidth:'315px',borderColor:'rgba(0, 0, 0, 0.456)'}} type='text' placeholder='Enter Answer'>{props.dataEdit1.correctOption}</textarea>
             } 
         </div>
             {showRichText === true && <Editor
               toolbarClassName="toolbarClassName"
               wrapperClassName="wrapperClassName"
               editorClassName="editorClassName"
               ref={subjectiveAnswerRef}
               editorState={editorState}
               onEditorStateChange={(newState) => {
                 setEditorState(newState);
               }}
               wrapperStyle={{
                 width: '70%',
                 marginBottom:'10px',
                 border:'1px solid #DAEAF1',
                 minHeight:"300px",
                 minWidth:"315px",
                 maxHeight: '300px',
                 overflowX:"hidden",
                 // overflowY:"auto"
               }}
             />}
           {/* <Editor
             toolbarClassName="toolbarClassName"
             wrapperClassName="wrapperClassName"
             editorClassName="editorClassName"
             ref={helloRef}
             editorState={editorState}
             onEditorStateChange={(newState) => {
               setEditorState(newState);
             }}
             wrapperStyle={{
               width: '100%',
               height: 300,
             }}
           /> */}
       <div>
         <button className={styles.button} onClick={handlePlain}>
           UPDATE
         </button>
       </div>
     </div>}
        
    </div>
    </>
    
  )
}

export default Editpool

//defaultChecked={props.dataEdit1.correctOption === 'true'? true:false}
//defaultChecked={props.dataEdit1.correctOption === 'false'? true:false}