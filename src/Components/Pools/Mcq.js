import styles from './Mcq.module.css';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import React, { useRef, useState } from 'react';
import { convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
// import { stateToHTML } from 'draft-js-export-html';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Mcq = (props) => {
  const rtOption1 = useRef('');
  const rtOption2 = useRef('');
  const rtOption3 = useRef('');
  const rtOption4 = useRef('');
  const inputOption1 = useRef('');
  const inputOption2 = useRef('');
  const inputOption3 = useRef('');
  const inputOption4 = useRef('');
  const correctOptionRef = useRef('')
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [editorState2, setEditorState2] = useState(EditorState.createEmpty());
  const [editorState3, setEditorState3] = useState(EditorState.createEmpty());
  const [editorState4, setEditorState4] = useState(EditorState.createEmpty());

  const [op1, setop1] = useState();
  const [op2, setop2] = useState();
  const [op3, setop3] = useState();
  const [op4, setop4] = useState();

  const [correctOption,setCorrectOption]=useState(null);

  let mcq={};

  const handleMcq = () => {

    if ( inputOption1.current.value.trim().length === 0 ||
      inputOption2.current.value.trim().length === 0 ||
      inputOption3.current.value.trim().length === 0 ||
      inputOption4.current.value.trim().length === 0 ) {
        toast.error('You cant leave options Empty', {
          position: toast.POSITION.TOP_CENTER,
        });
        return;
    }

    mcq={
      options:[inputOption1.current.value,inputOption2.current.value,inputOption3.current.value,inputOption4.current.value],
      // option1:inputOption1.current.value,
      // option2:inputOption2.current.value,
      // option3:inputOption3.current.value,
      // option4:inputOption4.current.value,
      correctOption: correctOption,
      questionType:"Mcq"
    }

    console.log(mcq);
    props.getMcqs(mcq);


    // if ( rtOption1.current.state.editorState.getCurrentContent().getPlainText() === '' ||
    //   rtOption2.current.state.editorState.getCurrentContent().getPlainText() === '' ||
    //   rtOption3.current.state.editorState.getCurrentContent().getPlainText() === '' ||
    //   rtOption4.current.state.editorState.getCurrentContent().getPlainText() === '') {
    //   toast.error('You cant leave QUESTION/editorMainDiv empty', {
    //     position: toast.POSITION.TOP_CENTER,
    //   });
    // } 
    // else {
    //   let mcqData = {
    //     editorMainDiv: [
    //       rtOption1.current.state.editorState.getCurrentContent().getPlainText(),
    //       rtOption2.current.state.editorState.getCurrentContent().getPlainText(),
    //       rtOption3.current.state.editorState.getCurrentContent().getPlainText(),
    //       rtOption4.current.state.editorState.getCurrentContent().getPlainText(),
    //     ],
    //     correctAnswer: rtOption1.current.state.editorState
    //       .getCurrentContent()
    //       .getPlainText(),
    //     questionType: 'MCQ',
    //   };
    //   setEditorState(EditorState.createEmpty());
    //   setEditorState2(EditorState.createEmpty());
    //   setEditorState3(EditorState.createEmpty());
    //   setEditorState4(EditorState.createEmpty());
    //   console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
      // props.sendMcq(mcqData);
    // }
  };

  return (
    <div className={styles.mcqMain}>
        <div className={styles.editorContainer}>
          <input onChange={(e)=>{setop1(e.target.value)}} ref={inputOption1} placeholder='Enter Option Here' type={"text"}></input>
          <label for="co">Correct Option: <input value={inputOption1.current.value} onChange={((e)=>{console.log(op1);setCorrectOption(op1)})} name='co' type={"radio"}></input> </label>
          {/* <Editor
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            ref={rtOption1}
            editorState={editorState}
            onEditorStateChange={(newState) => {
              setEditorState(newState);
            }}
            wrapperStyle={{
              width: '100%',
              height: 300,
            }}
          /> */}
        </div>
        <div className={styles.editorContainer}>
          <input onChange={(e)=>{setop2(e.target.value)}} ref={inputOption2} placeholder='Enter Option Here' type={"text"}></input>
          <label for="co">Correct Option: <input value={inputOption2.current.value} onChange={((e)=>{console.log(op2);setCorrectOption(op2)})}  name='co' type={"radio"}></input> </label>
          {/* <Editor
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            ref={rtOption2}
            editorState={editorState2}
            onEditorStateChange={(newState) => {
              setEditorState2(newState);
            }}
            wrapperStyle={{
              width: '100%',
              height: 300,
            }}
          /> */}
        </div>
        <div className={styles.editorContainer}>
          <input onChange={(e)=>{setop3(e.target.value)}} ref={inputOption3} placeholder='Enter Option Here' type={"text"}></input>
          <label for="co">Correct Option: <input value={inputOption3.current.value} onChange={((e)=>{console.log(op3);setCorrectOption(op3)})}  name='co' type={"radio"}></input> </label>

          {/* <Editor
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            ref={rtOption3}
            editorState={editorState3}
            onEditorStateChange={(newState) => {
              setEditorState3(newState);
            }}
            wrapperStyle={{
              width: '100%',
              height: 300,
            }}
          /> */}
        </div>
        <div className={styles.editorContainer}>
          <input onChange={(e)=>{setop4(e.target.value)}} ref={inputOption4} placeholder='Enter Option Here' type={"text"}></input>
          <label for="co">Correct Option: <input value={inputOption4.current.value} onChange={((e)=>{console.log(op4);setCorrectOption(op4)})}  name='co' type={"radio"}></input> </label>

          {/* <Editor
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            ref={rtOption4}
            editorState={editorState4}
            onEditorStateChange={(newState) => {
              setEditorState4(newState);
            }}
            wrapperStyle={{
              width: '100%',
              height: 300,
            }}
          /> */}
        </div>
      <div>
        <button className={styles.button} onClick={handleMcq}>
          Add
        </button>
      </div>
    </div>
  );
};

export default Mcq;
