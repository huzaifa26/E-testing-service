import styles from './Quiz.module.css'

import React, { useState } from 'react'
import {Tabs,Tab,Box} from '@mui/material'
import { TabContext, TabPanel } from '@mui/lab';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { convertToRaw, EditorState,createFromText } from 'draft-js';
import {Storage} from "../Utils/firebase";
import {ref,uploadBytes,getDownloadURL} from "firebase/storage";


function Quiz() {
const [createQuiz,setCreateQuiz] = useState(false)
const [value, setValue] = useState('1');
const [title, setTitle] = useState('');
const [time,setTime] = useState(1)
const [editorState, setEditorState] = useState(EditorState.createEmpty());


const handleChange = (event, newValue) => {
  setValue(newValue);
};

function showAddQuiz()
{
    setCreateQuiz(true)
}

function showMainQuiz()
{
    setCreateQuiz(false)
    setValue('1')
    setTitle('')
    setTime(1)
}

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


  return (
    <div className={styles.main}>
        {!createQuiz && <div className={styles.container}>
            <button className={styles.button} onClick={showAddQuiz}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/></svg> Quiz</button>
        </div>}

        {createQuiz && 
        <div>
            <Box sx={{ width: '100%' }}>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Detials" value='1'/>
                    <Tab label="Questions" value='2' />
                  </Tabs>
                </Box>

              <TabPanel value='1' index={0}>
                  <TextField id="outlined-basic" label="Quiz Title" variant="outlined" sx={{marginLeft:'-22px',marginTop:'10px'}} size="small"  value={title} onChange={(e) => setTitle(e.target.value)} required/>
                  <p className={styles.instructions}><b>Quiz Instructions:</b></p>
                  <div class={styles.infolist}>
                    <div className={styles.info}>1. You will have only <em>{time} minute&nbsp;</em> per each question.</div>
                    <div className={styles.info}>2. Once you select your answer, it can't be undone.</div>
                    <div className={styles.info}>3. You can't select any option once time goes off.</div>
                    <div className={styles.info}>4. You can't exit from the Quiz</div>
                    <div className={styles.info}>5. A complete quiz log will be created of your activities</div>
                  </div>
                  <p className={styles.instructions}><b>Options</b></p>
                  <div className={styles.Options}>
                  <input type="number" id="quantity" className={styles.input} name="quantity" defaultValue={time} onChange={(e) => {setTime(e.target.value)}} min='0.1' max='100'></input>
                  <p>minutes per question</p>
                  </div>
                  <div className={styles.Options1}>
                  <input type="checkbox" name="checkbox-1" id="checkbox-1" />
                  <label for="checkbox-1">Shuffle Answers</label> 
                  </div>
                  <div className={styles.Options1}>
                  <input type="checkbox" name="checkbox-1" id="checkbox-1" />
                  <label for="checkbox-1">Let Students See Correct Answer</label> 
                  </div>
                  <div className={styles.Options1}>
                  <input type="checkbox" name="checkbox-1" id="checkbox-1" />
                  <label for="checkbox-1">Do not allow Students to copy question text</label> 
                  </div>
                  <div className={styles.Options1}>
                  <input type="checkbox" name="checkbox-1" id="checkbox-1" />
                  <label for="checkbox-1">Detect Mobile</label> 
                  </div>
    
              </TabPanel>

              <TabPanel value='2' index={1}>
              <div className={styles.addQuestion}>
              <Editor
              toolbar={config}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              // ref={rtQuestionRef}
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
                overflow:"auto"
              }}
            />
              </div>


              <div className={styles.buttonContainer1}>
              <button className={styles.cancel}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/></svg>New Question</button>
              <button className={styles.cancel}><i class="bi bi-search"></i>Find Questions</button>
              </div>
              </TabPanel>
              
              </TabContext>
            </Box>
            <hr className={styles.hr}></hr>
            <div className={styles.buttonContainer}>
                <button onClick={showMainQuiz} className={styles.cancel}>Cancel</button>
                <button onClick={showMainQuiz} className={styles.save}>Save</button>
              </div>
            <hr></hr>

        </div>
        }
    </div>
  )
}

export default Quiz