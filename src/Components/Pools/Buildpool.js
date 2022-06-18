import styles from './Buildpool.module.css';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import React, { useRef, useState,useEffect } from 'react';
import Mcq from './Mcq';
import True from './True';
import Plain from './Plain';
import { useDispatch } from 'react-redux';
import { poolsActions } from './../../Redux/pools-slice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {ref,uploadBytes,getDownloadURL} from "firebase/storage";
import {Storage} from "../Utils/firebase";
import { MathComponent } from 'mathjax-react';

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

function Buildpool() {
  const dispatch=useDispatch();

  const [mcq, setmcq] = useState(false);
  const [trues, settrues] = useState(false);
  const [plain, setplain] = useState(false);
  const [courseId, setCourseId] = useState('');
  const rtQuestionRef = useRef('');
  const inputQuestionRef = useRef('');
  const [courseName, setCourseName] = useState('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [showRichText,setShowRichText]=useState(false);
  const [isCourseSelected,setIsCourseSelected]=useState(false);
  const [selectedPoolCategory,setSelectedPoolCategory]=useState();
  const [questionInputType,setQuestionInputType]=useState("Input");

  const [text, setText] = useState(String.raw``);


  
  const publishCourses=useSelector(state=>{return state.courseId_Name.courseIdName});
  const user=useSelector(state=>{return state.user;})

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
        setCourseName(element.courseName);
        setIsCourseSelected(true);
        let url="http://localhost:5000/api/poolCategory/"+e.target.value+ "/" + user.userInfo.user.id;
        axios.get(url).then((res)=>{
          console.log(res.data.data);
          setPoolCategory(res.data.data);
        }).catch((err)=>{
          console.log(err)
        })
      }
    });
  }

  const getMcqs = (mcqData) => {
    mcqData.courseId = courseId;

    if(questionInputType === "Input"){
      if (mcqData.courseId === '') {
        toast.error('Select Course Please', {
          position: toast.POSITION.TOP_CENTER,
        });
      } else if (inputQuestionRef.current.value.trim().length === 0) {
        toast.error('You cant leave QUESTION/OPTIONS empty', {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        mcqData.question = inputQuestionRef.current.value;
        mcqData.courseName = courseName;
        mcqData.poolCategory = selectedPoolCategory;
        mcqData.userId = user.userInfo.user.id;
        console.log(mcqData);
  
        let url="http://localhost:5000/api/poolQuestions/";
  
        axios.post(url,mcqData).then((res)=>{
          console.log("res")
        }).catch((err)=>{
          console.log("err")
        })
        // dispatch(poolsActions.allQuestions(mcqData));
        toast.success('Added', {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    }
    
    if (questionInputType === "Rich box"){
      if (mcqData.courseId === '') {
        toast.error('Select Course Please', {
          position: toast.POSITION.TOP_CENTER,
        });
      } else if (rtQuestionRef.current.state.editorState.getCurrentContent().getPlainText().trim().length === 0) {
        toast.error('You cant leave QUESTION/OPTIONS empty', {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        // mcqData.question = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        let question = convertToRaw(editorState.getCurrentContent());
        setText(question.blocks[0].text);
        mcqData.question = question.blocks[0].text;
        mcqData.courseName = courseName;
        mcqData.poolCategory = selectedPoolCategory;
        mcqData.userId = user.userInfo.user.id;
  
        // setEditorState(EditorState.createEmpty());
  
        let url="http://localhost:5000/api/poolQuestions/";
        axios.post(url,mcqData).then((res)=>{
          console.log("res")
        }).catch((err)=>{
          console.log("err")
        })
        // dispatch(poolsActions.allQuestions(mcqData));
        toast.success('Added', {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    }
  };

  const getTrues = (truesData) => {
    truesData.courseId = courseId;

    if (truesData.courseId === '') {
      toast.error('Select Course Please', {
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (inputQuestionRef.current.value.trim().length === 0) {
      toast.error('You cant leave QUESTION/OPTIONS empty', {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      truesData.question = inputQuestionRef.current.value;
      truesData.courseName = courseName;
      truesData.poolCategory = selectedPoolCategory;
      truesData.userId = user.userInfo.user.id;

      let url="http://localhost:5000/api/poolQuestions/";

      axios.post(url,truesData).then((res)=>{
        console.log("res")
      }).catch((err)=>{
        console.log("err")
      })
      // dispatch(poolsActions.allQuestions(truesData));
      toast.success('Added', {
        position: toast.POSITION.TOP_CENTER,
      });
    }

    // if (truesData.courseId === '') {
    //   toast.error('Select Course Please', {
    //     position: toast.POSITION.TOP_CENTER,
    //   });
    // } else if (
    //   rtQuestionRef.current.state.editorState.getCurrentContent().getPlainText() ===''
    // ) {
    //   toast.error('You cant leave question empty', {
    //     position: toast.POSITION.TOP_CENTER,
    //   });
    // } else if (truesData.correctAnswer === '') {
    //   toast.error('You have to select True/False', {
    //     position: toast.POSITION.TOP_CENTER,
    //   });
    // } else {
    //   truesData.question = draftToHtml(convertToRaw(editorState.getCurrentContent()));
      
    //   setEditorState(EditorState.createEmpty());
    //   truesData.courseName = courseName;
    //   dispatch(poolsActions.allQuestions(truesData));
      
    //   toast.success('Added', {
    //     position: toast.POSITION.TOP_CENTER,
    //   });
    // }
  };

  const getPlain = (plainData) => {
    plainData.courseId = courseId;
    

    if (plainData .courseId === '') {
      toast.error('Select Course Please', {
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (inputQuestionRef.current.value.trim().length === 0) {
      toast.error('You cant leave QUESTION/OPTIONS empty', {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      plainData.question = inputQuestionRef.current.value;
      plainData.courseName = courseName;
      plainData.poolCategory = selectedPoolCategory;
      plainData.userId = user.userInfo.user.id;

      let url="http://localhost:5000/api/poolQuestions/";

      axios.post(url,plainData).then((res)=>{
        console.log("res")
      }).catch((err)=>{
        console.log("err")
      })
      // dispatch(poolsActions.allQuestions(plainData));
      toast.success('Added', {
        position: toast.POSITION.TOP_CENTER,
      });
    }


    // if (plainData.courseId === '') {
    //   toast.error('Select Course Please', {
    //     position: toast.POSITION.TOP_CENTER,
    //   });
    // } else if (
    //   rtQuestionRef.current.state.editorState.getCurrentContent().getPlainText() ===''
    // ) {
    //   toast.error('You cant leave question empty', {
    //     position: toast.POSITION.TOP_CENTER,
    //   });
    // } else if (plainData.correctAnswer === '') {
    //   toast.error('You have to write answer', {
    //     position: toast.POSITION.TOP_CENTER,
    //   });
    // } else {
    //   plainData.question = draftToHtml(convertToRaw(editorState.getCurrentContent()));

    //   setEditorState(EditorState.createEmpty());
    //   plainData.courseName = courseName;
      
    //   dispatch(poolsActions.allQuestions(plainData));
    //   toast.success('Added', {
    //     position: toast.POSITION.TOP_CENTER,
    //   });
    // }
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
        resolve({ data: { link: "res"} });
      };
      reader.readAsDataURL(file);
    });
  };

  const config={
    image: { uploadCallback: uploadCallback },
  };

  return (
    <div>
        <div className={styles.labelMain}>
      <div className={styles.labelCourse}>
        <label>
          Select Course&nbsp;&nbsp;&nbsp;:
        </label>
        <select onChange={handlePublishCourses}>
          <option value="" selected disabled hidden>
            Choose Course
          </option>
          {publishCourses.map((value) => {
            return <option value={value.id}>{value.courseName}</option>;
          })}
        </select>
      </div>
      {isCourseSelected && <div className={styles.labelCourse2}>
        <label>
          Select Category:
        </label>
        <select onChange={(e)=>{setSelectedPoolCategory(e.target.value)}}>
          <option value="" selected disabled hidden>
            Choose Category
          </option>
          {poolCategory !== "" && poolCategory.map((value) => {
            return <option value={value.id}>{value.categoryName}</option>;
          })}
        </select>
      </div>}
      <div className={styles.labelCourse}>
        <label>Question Type&nbsp;&nbsp;&nbsp;:</label>
        <select onChange={questionTypeHandler}>
          <option value="" selected disabled hidden>
            Choose Type
          </option>
          {category.map((value) => {
            return <option value={value.id}>{value.name}</option>;
          })}
        </select>
      </div>
      </div>
      <hr></hr>

        {(mcq || trues || plain) && <div>
          <div className={styles.editor2}>
            {/* <div className={styles.radioDiv}>
              <input onChange={changeInputHandler} defaultChecked type="radio" id="input" name="questionInput" value="Input"/>
              <label htmlFor="input">Input</label>
              <input onChange={changeInputHandler} type="radio" id="input" name="questionInput" value="Rich box"/>
              <label htmlFor="input">Rich Text</label>
            </div> */}
            <h1>Question</h1>
            <MathComponent tex={text} />
            {/*  */}
            <>
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
            <ToastContainer />
          </div>
        </div>}
    </div>
  );
}

export default Buildpool;
