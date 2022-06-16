import styles from './Plain.module.css';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import React, { useRef, useState } from 'react';
import { convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';

function Plain(props) {
  const subjectiveAnswerRef = useRef('');
  const inputSubjectiveAnswerRef=useRef('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [showRichText,setShowRichText]=useState(false);

  const handlePlain = () => {

    let subjectiveQuestion = {
      questionType: 'Subjective',
      correctOption: inputSubjectiveAnswerRef.current.value,
    };
    props.getPlain(subjectiveQuestion);

    // let plainData = {
    //   options: ['Question/Answer', 'Fill in the blanks'],
    //   questionType: 'TEXT',
    //   correctAnswer: helloRef.current.state.editorState.getCurrentContent().getPlainText(),
    // };
    // console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
    // setEditorState(EditorState.createEmpty());
    // props.sendPlain(plainData);
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
            <textarea ref={inputSubjectiveAnswerRef} rows={11} style={{width: "100%",resize:"none",minWidth:'315px',borderColor:'rgba(0, 0, 0, 0.456)'}} type='text' placeholder='Enter Answer'></textarea>
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
          Add
        </button>
      </div>
    </div>
  );
}

export default Plain;
