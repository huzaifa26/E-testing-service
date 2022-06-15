import styles from './Plain.module.css';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import React, { useRef, useState } from 'react';
import { convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';

function Plain(props) {
  const helloRef = useRef('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [showRichText,setShowRichText]=useState(false);

  const handlePlain = () => {
    let plainData = {
      options: ['Question/Answer', 'Fill in the blanks'],
      questionType: 'TEXT',
      correctAnswer: helloRef.current.state.editorState.getCurrentContent().getPlainText(),
    };
    console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
    setEditorState(EditorState.createEmpty());
    props.sendPlain(plainData);
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
      <div className={styles.editorContainer}>
        <h3>Answer</h3>
        <div className={styles.editor}>
        <div className={styles.radioDiv}>
              <input onChange={changeInputHandler}  defaultChecked type="radio" id="input" name="subjectiveInput" value="Input"/>
              <label for="input">Input</label>
              <input onChange={changeInputHandler} type="radio" id="input" name="subjectiveInput" value="Rich box"/>
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
        </div>
      </div>
      <div>
        <button className={styles.button} onClick={handlePlain}>
          Add
        </button>
      </div>
    </div>
  );
}

export default Plain;
