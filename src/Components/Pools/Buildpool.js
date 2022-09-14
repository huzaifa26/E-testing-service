import styles from './Buildpool.module.css';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { convertToRaw, EditorState,createFromText } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import React, { useRef, useState,useEffect } from 'react';
import Mcq from './Mcq';
import True from './True';
import Plain from './Plain';
import { useDispatch } from 'react-redux';
import { poolsActions } from './../../Redux/pools-slice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
<<<<<<< HEAD



const publishCourses = [
  {
    id: 1,
    name: 'Database',
  },
  {
    id: 3,
    name: 'Assembly language',
  },
];
=======
import { useSelector } from 'react-redux';
import axios from 'axios';
import {ref,uploadBytes,getDownloadURL} from "firebase/storage";
import {Storage} from "../Utils/firebase";
import { MathComponent } from 'mathjax-react';
import { useCookies } from 'react-cookie';
>>>>>>> master

const category = [
  {
    id: 1,
    name: "MCQ's",
  },
  {
    id: 2,
    name: 'True/False',
  },
  {
    id: 3,
    name: 'Subjective',
  },
];

function Buildpool(props) {
  const [cookie]=useCookies();
  const dispatch=useDispatch();

  const [mcq, setmcq] = useState(false);
  const [trues, settrues] = useState(false);
  const [plain, setplain] = useState(false);
  const [courseId, setCourseId] = useState('');
  const rtQuestionRef = useRef('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [selectedPoolCategory,setSelectedPoolCategory]=useState("");
  const [text, setText] = useState(String.raw``);

  const courseIdredux=useSelector(state => state.getCourseIdOnClick.getCourseIdOnClick);
  const publishCourses=useSelector(state=>{return state.courseId_Name.courseIdName});
  const courseCategoriesredux=useSelector(state => state.courseCategories.courseCategories);
  const abc=useSelector(state => {console.log(state);return state});


  const user=useSelector(state=>{return state.user;})
  let courseName=useSelector(state=>{console.log(state.courseId_Name.courseIdName);return state.courseId_Name.courseIdName});
  // console.log(courseName);
  courseName=courseName.filter((item,i)=> item.id === courseIdredux);
  console.log(courseName);

  function questionTypeHandler(e) {
    const ids = e.target.value;

    if (ids === '1'){
      setmcq(true);
      settrues(false);
      setplain(false);
    }
    if (e.target.value === '2'){
      setmcq(false);
      settrues(true);
      setplain(false);
    }
    if (e.target.value === '3'){
      setmcq(false);
      settrues(false);
      setplain(true);
    }
  }

  const [poolCategory,setPoolCategory]=useState("");

  function handlePublishCourses(e) {
    setCourseId(e.target.value);
    publishCourses.forEach((element) => {
      if (parseInt(e.target.value) === element.id) {
        let url="http://localhost:5000/api/poolCategory/"+e.target.value+ "/" + user.userInfo.user.id;
        axios.get(url,{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}).then((res)=>{
          console.log(res.data.data);
          setPoolCategory(res.data.data);
        }).catch((err)=>{
          console.log(err)
        })
      }
    });
  }

  const getMcqs = (mcqData) => {
    mcqData.courseId = courseIdredux;
    
    if (mcqData.courseId === '') {
      toast.error('Select Course Please', {
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (rtQuestionRef.current.state.editorState.getCurrentContent().getPlainText().trim().length === 0) {
      toast.error('You cant leave QUESTION/OPTIONS empty', {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      let question = convertToRaw(editorState.getCurrentContent());
      setText(question.blocks[0].text);
      mcqData.question = question.blocks[0].text;
      mcqData.courseName = courseName[0].courseName;
      mcqData.poolCategory = selectedPoolCategory;
      mcqData.userId = user.userInfo.user.id;

      if (imageURL !== ""){
        mcqData.questionImg=imageURL;
      }

      mcqData.isMathJax=isMathJax;

      console.log(mcqData);
      let url="http://localhost:5000/api/poolQuestions/";
      axios.post(url,mcqData,{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}).then((res)=>{
        toast.success('Added', {
          position: toast.POSITION.TOP_CENTER,
        });
        props.changeView();
        console.log("res")
      }).catch((err)=>{
        console.log(err)
        toast.error('Failed', {
          position: toast.POSITION.TOP_CENTER,
        });
      })

    }
  };

  const getTrues = (truesData) => {
    truesData.courseId = courseIdredux;
    if (truesData.courseId.length === 0) {
      toast.error('Select Course Please', {
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (
      rtQuestionRef.current.state.editorState.getCurrentContent().getPlainText() ===''
    ) {
      toast.error('You cant leave question empty', {
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (truesData.correctAnswer === '') {
      toast.error('You have to select True/False', {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      let question = convertToRaw(editorState.getCurrentContent());
      setText(question.blocks[0].text);
      truesData.question = question.blocks[0].text;
      truesData.courseName = courseName[0].courseName;
      truesData.poolCategory = selectedPoolCategory;
      truesData.userId = user.userInfo.user.id;

      if (imageURL !== ""){
        truesData.questionImg=imageURL;
      }

      truesData.isMathJax=isMathJax;


      console.log(truesData);
      let url="http://localhost:5000/api/poolQuestions/";
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
    }
  };

  const getPlain = (plainData) => {
    plainData.courseId = courseIdredux;

    if (plainData.courseId === '') {
      toast.error('Select Course Please', {
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (
      rtQuestionRef.current.state.editorState.getCurrentContent().getPlainText() ===''
    ) {
      toast.error('You cant leave question empty', {
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (plainData.correctAnswer === '') {
      toast.error('You have to write answer', {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      let question = convertToRaw(editorState.getCurrentContent());
      setText(question.blocks[0].text);
      plainData.question = question.blocks[0].text;
      plainData.courseName = courseName[0].courseName;
      plainData.poolCategory = selectedPoolCategory;
      plainData.userId = user.userInfo.user.id;
      
      if (imageURL !== ""){
        plainData.questionImg=imageURL;
      }

      plainData.isMathJax=isMathJax;

      console.log(plainData);
      let url="http://localhost:5000/api/poolQuestions/";
      axios.post(url,plainData,{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}).then((res)=>{
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
    }
  };


  // const changeInputHandler = (e) => {
  //   console.log(e.target.value);
  //   setQuestionInputType(e.target.value);
  //   if (e.target.value === "Input"){
  //     setShowRichText(false);
  //   } else if (e.target.value === "Rich box"){
  //     setShowRichText(true);
  //   }
  // }

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

  const [isMathJax,setIsMathjax]=useState(false);

  return (
    <div>
      <div className={styles.labelMain}>
      <div className={styles.labelCourse2}>
        <label>
          Select Category:
        </label>
        <select onChange={(e)=>{setSelectedPoolCategory(e.target.value)}}>
          <option value="" selected disabled hidden>
            Choose Category
          </option>
          {courseCategoriesredux.length !== 0 && courseCategoriesredux.map((value) => {
            return <option value={value.id}>{value.categoryName}</option>;
          })}
        </select>
      </div>
      {selectedPoolCategory !== "" && <div className={styles.labelCourse}>
        <label>Question Type&nbsp;&nbsp;&nbsp;:</label>
        <select onChange={questionTypeHandler}>
          <option value="" selected disabled hidden>
            Choose Type
          </option>
          {category.map((value) => {
            return <option value={value.id}>{value.name}</option>;
          })}
        </select>
      </div>}
      </div>
        {(mcq || trues || plain) && <div>
          <div className={styles.editor2}>
            {/* <div className={styles.radioDiv}>
              <input onChange={changeInputHandler} defaultChecked type="radio" id="input" name="questionInput" value="Input"/>
              <label htmlFor="input">Input</label>
              <input onChange={changeInputHandler} type="radio" id="input" name="questionInput" value="Rich box"/>
              <label htmlFor="input">Rich Text</label>
            </div> */}
            <h1 className={styles.h11}>Question</h1>
            {/* <h2 style={{fontSize:"20px",fontWeight:'500'}} className={styles.question}><MathComponent tex={text} /></h2> */}
            
            <>
            <div className={styles.true}>
              <label>Use MathJax:  
                <input type="checkbox" name="isTrue" value="true"
                  onClick={(e) => {
                    console.log(!isMathJax);
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
            </>
            {mcq && <Mcq getMcqs={getMcqs} />}
            {trues && <True getTrues={getTrues} />}
            {plain && <Plain getPlain={getPlain} />}
          </div>
        </div>}
    </div>
  );
}

export default Buildpool;