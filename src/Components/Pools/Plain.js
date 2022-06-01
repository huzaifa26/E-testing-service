import styles from './Plain.module.css';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import React, { useRef, useState } from 'react';
import { convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';

function Plain(props) {
  const helloRef = useRef('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

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

  return (
    <div className={styles.editor1}>
      <div className={styles.options}>
        <h3>Answer</h3>
        <div className={styles.editor2}>
          <Editor
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
          />
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
