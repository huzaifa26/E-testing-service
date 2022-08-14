import styles from './Quiz.module.css'
import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import {TabContext, TabPanel} from '@mui/lab';
import {Tabs,Tab,Box} from '@mui/material'
import {Editor} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {EditorState} from 'draft-js';
import {Storage} from "../Utils/firebase";
import {ref,uploadBytes,getDownloadURL} from "firebase/storage";

function Quiz() {
const [createQuiz,setCreateQuiz] = useState(false)
const [value, setValue] = useState('1');
const [title, setTitle] = useState('');
const [time,setTime] = useState(1)
const [editorState, setEditorState] = useState(EditorState.createEmpty());
const [imageURL , setImageURL] = useState('');
const [pts,setpts] = useState(1)
const [mcq, setMcq] = useState(true);
const [trues, setTrues] = useState(false);
const [subjective, setSubjective] = useState(false);
const [add,setAdd] = useState(false)
const [inputFields, setInputFields] = useState([
  {name: ''},
  {name: ''},
])
function handleChange(event, newValue)
{
  setValue(newValue);
}

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

function questionTypeHandler(e) 
{
  if (e.target.value === '1'){
    setMcq(true);
    setTrues(false);
    setSubjective(false);
  }
  if (e.target.value === '2'){
    setMcq(false);
    setTrues(true);
    setSubjective(false);
  }
  if (e.target.value === '3'){
    setMcq(false);
    setTrues(false);
    setSubjective(true);
  }
  if (e.target.value === '3'){
    setMcq(true);
    setTrues(false);
    setSubjective(false);
  }
}

const uploadCallback = (file, callback) => 
{
  return new Promise((resolve, reject) => {
      const reader = new window.FileReader();
      reader.onloadend = async () => 
      {
      console.log(file)
      const storageRef = ref(Storage, `/questionPictures/${file.name}`);
      const uploadTask = await uploadBytes(storageRef, file);
      getDownloadURL(ref(Storage, `/questionPictures/${file.name}`)).then((url) => {
          console.log(url);
          setImageURL(url);
      });
      resolve({ data: { link: "Uploaded"} });
      };
      reader.readAsDataURL(file);
  });
};

const config =
{
  image: { uploadCallback: uploadCallback },
};

//This onChange event takes two parameters, index and event. Index is the index of the array and event is the data we type in the input field. We are passing those to the handleFormChange function.
const handleFormChange = (index, event) => {
  let data = [...inputFields];
  data[index][event.target.name] = event.target.value;
  setInputFields(data);
}

const handleCorrect = (index, event) => {
  console.log(event.target.value)
  console.log(index)
}

const addFields = () => {

  if(inputFields.length<=4)
  {
    let newfield = { name: ''}
    setInputFields([...inputFields, newfield])
  }
  else
  {
    alert('you cant add more than 5 possible answers')
  }
}

const removeFields = (index,event) => {
  console.log(inputFields.length)
  if(inputFields.length<3 )
  {
      alert('Minimim 2 possible answers are allowed')
  }
  else
  {
    let data = [...inputFields];
    data.splice(index, 1)
    setInputFields(data)
    
  }
}



return (
<div className={styles.main}>
  {!createQuiz &&
    <div className={styles.container}>
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
            <input type="number" id="quantity" className={styles.input} name="quantity" defaultValue={time} onChange={(e) => {setTime(e.target.value)}} min='1' max='100'></input>
            <p>minutes per question</p>
          </div>
          
          <div className={styles.Options1}>
            <input type="checkbox" name="checkbox-1" id="checkbox-1" />
            <label for="checkbox-1">Shuffle Questions</label> 
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
        {add && 
        <div className={styles.holder}>
          <div className={styles.header}>
          <div className={styles.select}>
            <select onChange={questionTypeHandler} >
                <option value='1' selected>Multiple Choice</option>;
                <option value='2'>True/False</option>;
                <option value='3'>Subjective Question</option>;
                <option value='4'>Formula Question</option>;
            </select>
          </div>

          <div className={styles.second}>
            <div className={styles.Options}>
                    <p>min:</p>
                    <input type="number" id="quantity" className={styles.input} name="quantity" defaultValue={pts} onChange={(e) => {setpts(e.target.value)}} min='1' max='100'></input>
            </div>
            <div className={styles.Options}>
                    <p>pts:</p>
                    <input type="number" id="quantity" className={styles.input} name="quantity" defaultValue={pts} onChange={(e) => {setpts(e.target.value)}} min='1'></input>
            </div>
          </div>
          </div>

          <div className={styles.addQuestion}>
            <div>
              <p className={styles.p1}>Question:</p>
            </div>

            <div className={styles.editorContainer}>
              <Editor
              toolbar={config}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              // ref={rtQuestionRef}
              editorState={editorState}
              onEditorStateChange={(newState) => {setEditorState(newState);}}
              wrapperStyle={{
              width: '95%',
              marginBottom:'10px',
              border:'1px solid #DAEAF1',
              minHeight:"300px",
              minWidth:"315px",
              maxHeight: '300px',
              overflow:"clip"}}
              />
            </div>

            <div>
              <p className={styles.p1}>Answers:</p>
            </div>

            {mcq &&
             <div className={styles.answerContainer}>
               {inputFields.map((input, index) => {
                return (
                  <div key={index} className={styles.element}>
                    <div className={styles.inputContainer}>
                    <input type="radio" value={inputFields[index].name} onChange={event => handleCorrect(index, event)} name="correct" />
                    <input
                      name='name'
                      placeholder='Answer Text'
                      type='text'
                      value={input.name}
                      onChange={event => handleFormChange(index, event)}
                      />
                    </div>
                    <i class="bi bi-trash3"></i>
                    <svg onClick={() => removeFields(index)} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="red" class="bi bi-trash3" viewBox="0 0 16 16"><path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/></svg>
                  </div>
                )
              })}
              <div className={styles.paragraphContain}>
              <p className={styles.p2} onClick={addFields}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/></svg>Add another answer</p>
              </div>
             </div>}
             
              <div className={styles.footer}>
                <div style={{width:'95%',gap:'10px'}}>
                  <button className={styles.cancel3} onClick={() => setAdd(false)}>Cancel</button>
                  <button className={styles.save3}onClick={(e) => {e.preventDefault();console.log(inputFields)}}>Add</button>
                </div>
              </div>
          </div>    
          </div>}

          <div className={styles.buttonContainer1}>
            <button className={styles.cancel} onClick={() => setAdd(true)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/></svg>New Question</button>
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
    
    </div>}
</div>)}

export default Quiz