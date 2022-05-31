import styles from './Mcq.module.css';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import React, { useRef } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Mcq = (props) => {
  const correctOption = useRef('');
  const option2 = useRef('');
  const option3 = useRef('');
  const option4 = useRef('');

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
      toast.error('You cant leave QUESTION/OPTIONS empty', {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      let mcqData = {
        options: [
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
      props.sendMcq(mcqData);
    }
  };

  return (
    <div className={styles.editor1}>
      <div className={styles.options}>
        <h5>Correct Option</h5>
        <div className={styles.editor2}>
          <Editor
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            ref={correctOption}
            wrapperStyle={{
              width: '100%',
              height: 300,
            }}
          />
        </div>
      </div>
      <div className={styles.options}>
        <h5>Option 2</h5>
        <div className={styles.editor2}>
          <Editor
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            ref={option2}
            wrapperStyle={{
              width: '100%',
              height: 300,
            }}
          />
        </div>
      </div>
      <div className={styles.options}>
        <h5>Option 3</h5>
        <div className={styles.editor2}>
          <Editor
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            ref={option3}
            wrapperStyle={{
              width: '100%',
              height: 300,
            }}
          />
        </div>
      </div>
      <div className={styles.options}>
        <h5>Option 4</h5>
        <div className={styles.editor2}>
          <Editor
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            ref={option4}
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
