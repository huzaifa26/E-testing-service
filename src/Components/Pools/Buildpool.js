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
import createMathjaxPlugin from 'draft-js-mathjax-plugin';
import axios from 'axios';
import { useSelector } from 'react-redux';

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
    name: 'Plain Text',
  },
];

function Buildpool() {
  const user=useSelector(state=> state.user);

  const [mcq, setmcq] = useState(false);
  const [trues, settrues] = useState(false);
  const [plain, setplain] = useState(false);
  const [courseId, setCourseId] = useState('');
  const helloRef = useRef('');
  const [courseName, setCourseName] = useState('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [publishCourses,setPublishedCourses]=useState([]);
  const [showRichText,setShowRichText]=useState(false);
  

  useEffect(()=>{
    let link='http://localhost:5000/api/getCourseName/' + user.userInfo.user.id;
    axios.get(link).then((res)=>{
      console.log(res.data.data);
      setPublishedCourses(res.data.data);
    }).catch((err)=>{
      console.log(err);
    })
  },[])

  const dispatch = useDispatch();

  function handleCategory(e) {
    const ids = e.target.value;

    if (ids === '1') {
      setmcq(true);
      settrues(false);
      setplain(false);
    }
    if (e.target.value === '2') {
      setmcq(false);
      settrues(true);
      setplain(false);
    }
    if (e.target.value === '3') {
      setmcq(false);
      settrues(false);
      setplain(true);
    }
  }

  function handlePublishCourses(e) {
    setCourseId(e.target.value);
    publishCourses.forEach((element) => {
      if (parseInt(e.target.value) === element.id) {
        setCourseName(element.name);
      }
    });
  }

  const sendMcq = (mcqData) => {
    mcqData.courseId = courseId;
    if (mcqData.courseId === '') {
      toast.error('Select Course Please', {
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (
      helloRef.current.state.editorState.getCurrentContent().getPlainText() ===''
    ) {
      toast.error('You cant leave QUESTION/OPTIONS empty', {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      mcqData.question = draftToHtml(convertToRaw(editorState.getCurrentContent()));

      setEditorState(EditorState.createEmpty());

      mcqData.courseName = courseName;

      dispatch(poolsActions.allQuestions(mcqData));
      toast.success('Added', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  const sendTrues = (truesData) => {
    truesData.courseId = courseId;

    if (truesData.courseId === '') {
      toast.error('Select Course Please', {
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (
      helloRef.current.state.editorState.getCurrentContent().getPlainText() ===''
    ) {
      toast.error('You cant leave question empty', {
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (truesData.correctAnswer === '') {
      toast.error('You have to select True/False', {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      truesData.question = draftToHtml(convertToRaw(editorState.getCurrentContent()));
      
      setEditorState(EditorState.createEmpty());
      truesData.courseName = courseName;
      dispatch(poolsActions.allQuestions(truesData));
      
      toast.success('Added', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  const sendPlain = (plainData) => {
    plainData.courseId = courseId;
    
    if (plainData.courseId === '') {
      toast.error('Select Course Please', {
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (
      helloRef.current.state.editorState.getCurrentContent().getPlainText() ===
      ''
    ) {
      toast.error('You cant leave question empty', {
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (plainData.correctAnswer === '') {
      toast.error('You have to write answer', {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      plainData.question = draftToHtml(convertToRaw(editorState.getCurrentContent()));

      setEditorState(EditorState.createEmpty());
      plainData.courseName = courseName;
      
      dispatch(poolsActions.allQuestions(plainData));
      toast.success('Added', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  const changeInputHandler = (e) => {
    console.log(e.target.value);
    if (e.target.value === "Input"){
      setShowRichText(false);
    } else if (e.target.value === "Rich box"){
      setShowRichText(true);
    }
  }

  return (
    <div>
      <div className={styles.labelCourse}>
        <label>
          Select Course &nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;
        </label>
        <select onChange={handlePublishCourses}>
          <option value="" selected disabled hidden>
            Choose here
          </option>
          {publishCourses.map((value) => {
            return <option value={value.id}>{value.courseName}</option>;
          })}
        </select>
      </div>
      <div className={styles.labelCategory}>
        <label>Select Category :&nbsp; </label>
        <select onChange={handleCategory}>
          <option value="" selected disabled hidden>
            Choose here
          </option>
          {category.map((value) => {
            return <option value={value.id}>{value.name}</option>;
          })}
        </select>
      </div>
        {(mcq || trues || plain) && <div>
          <h4>Question Text</h4>
          <div style={showRichText ? {paddingBottom:"70px"}:{paddingBottom:"20px"}} className={styles.editor2}>
            <div className={styles.radioDiv}>
              <input onChange={changeInputHandler} type="radio" id="input" name="questionInput" value="Input"/>
              <label for="input">Input</label>
              <input onChange={changeInputHandler} type="radio" id="input" name="questionInput" value="Rich box"/>
              <label for="input">Rich Text</label>
            </div>
            {showRichText === false && 
              <textarea rows={8} style={{width:"600px",resize:"none"}} type='text' placeholder='Enter your Question'></textarea>
            } 
            {showRichText === true && <Editor
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
            />}
            {mcq && <Mcq sendMcq={sendMcq} />}
            {trues && <True sendTrues={sendTrues} />}
            {plain && <Plain sendPlain={sendPlain} />}
            <ToastContainer />
          </div>
        </div>}
      <hr></hr>
    </div>
  );
}

export default Buildpool;
