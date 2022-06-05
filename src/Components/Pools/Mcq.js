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
  const correctOption = useRef('');
  const option2 = useRef('');
  const option3 = useRef('');
  const option4 = useRef('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [editorState2, setEditorState2] = useState(EditorState.createEmpty());
  const [editorState3, setEditorState3] = useState(EditorState.createEmpty());
  const [editorState4, setEditorState4] = useState(EditorState.createEmpty());

  const handleMcq = () => {
    if (
      correctOption.current.state.editorState
        .getCurrentContent()
        .getPlainText() === '' ||
      option2.current.state.editorState.getCurrentContent().getPlainText() ===
        '' ||
      option3.current.state.editorState.getCurrentContent().getPlainText() ===
        '' ||
      option4.current.state.editorState.getCurrentContent().getPlainText() ===
        ''
    ) {
      toast.error('You cant leave QUESTION/editorMainDiv empty', {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      let mcqData = {
        editorMainDiv: [
          correctOption.current.state.editorState
            .getCurrentContent()
            .getPlainText(),
          option2.current.state.editorState.getCurrentContent().getPlainText(),
          option3.current.state.editorState.getCurrentContent().getPlainText(),
          option4.current.state.editorState.getCurrentContent().getPlainText(),
        ],
        correctAnswer: correctOption.current.state.editorState
          .getCurrentContent()
          .getPlainText(),
        questionType: 'MCQ',
      };
      setEditorState(EditorState.createEmpty());
      setEditorState2(EditorState.createEmpty());
      setEditorState3(EditorState.createEmpty());
      setEditorState4(EditorState.createEmpty());
      // console.log(editorState);
      console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
      props.sendMcq(mcqData);
    }
  };

  return (
    <div className={styles.mcqMain}>
      <div className={styles.editorMainDiv}>
        <h5>Correct Option</h5>
        <div className={styles.editorContainer}>
          <Editor
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            ref={correctOption}
            editorState={editorState}
            onEditorStateChange={(newState) => {
              setEditorState(newState);
            }}
            wrapperStyle={{
              width: '100%',
              height: 300,
            }}
          />
        </div>
      </div>
      <div className={styles.editorMainDiv}>
        <h5>Option 2</h5>
        <div className={styles.editorContainer}>
          <Editor
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            ref={option2}
            editorState={editorState2}
            onEditorStateChange={(newState) => {
              setEditorState2(newState);
            }}
            wrapperStyle={{
              width: '100%',
              height: 300,
            }}
          />
        </div>
      </div>
      <div className={styles.editorMainDiv}>
        <h5>Option 3</h5>
        <div className={styles.editorContainer}>
          <Editor
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            ref={option3}
            editorState={editorState3}
            onEditorStateChange={(newState) => {
              setEditorState3(newState);
            }}
            wrapperStyle={{
              width: '100%',
              height: 300,
            }}
          />
        </div>
      </div>
      <div className={styles.editorMainDiv}>
        <h5>Option 4</h5>
        <div className={styles.editorContainer}>
          <Editor
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            ref={option4}
            editorState={editorState4}
            onEditorStateChange={(newState) => {
              setEditorState4(newState);
            }}
            wrapperStyle={{
              width: '100%',
              height: 300,
            }}
          />
        </div>
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
