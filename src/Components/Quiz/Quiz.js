import styles from './Quiz.module.css';
import React, {useEffect,  useState } from 'react';
import TextField from '@mui/material/TextField';
import { TabContext, TabPanel } from '@mui/lab';
import { Tabs, Tab, Box, Stack, Paper, TablePagination, Button} from '@mui/material';
import CreateQuestion from './CreateQuestion';
import { useSelector } from 'react-redux';
import ImportPool from './ImportPool';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useCookies } from 'react-cookie';
import { styled } from '@mui/material/styles';
import DisplayQuiz from './DisplayQuiz';

function Quiz() {

const [cookie]=useCookies();
const courseIdredux=useSelector(state => state.getCourseIdOnClick.getCourseIdOnClick);
const courseClickUserId = useSelector(state => state.courseClickUserId.courseClickUserId)
const user=useSelector(state=> state.user);
//value is for tabs
const [value, setValue] = useState('1');
const [createQuiz, setCreateQuiz] = useState(false);
const [add, setAdd] = useState(false);
const [importPool,setImportPool] = useState(false)

const [quizQuestions,setQuizQuestions]=useState([]);
const [title, setTitle] = useState('');
const [time, setTime] = useState(30);
const [questionShuffle,setQuestionShuffle] = useState(false)
const [answerShuffle,setAnswerShuffle] = useState(false)
const [seeAnswer,setSeeAnswer] = useState(false)
const [copyQuestion,setCopyQuestion] = useState(false)
const [detectMobile,setDetectMobile] = useState(false)
const [startTime,setStartTime] = useState('')
const [endTime,setEndTime] = useState('') 
const [totalQuizzes,setTotalQuizzes] = useState([])


function handleChange(event, newValue) {
  setValue(newValue);
  setAdd(false)
}

function showAddQuiz() {
  setCreateQuiz(true);
}

function showMainQuiz() {
  console.log(time)
  setCreateQuiz(false);
  setQuizQuestions([])
  setTitle('')
  setStartTime('')
  setEndTime('')
  setTime(1)
}


useEffect(()=>{
  if(user?.userInfo?.hasOwnProperty("user") === true){
    axios.get("http://localhost:5000/api/getAllQuizzes/"+courseIdredux,{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}
    ).then((res)=>{
      console.log(res.data.data)
      setTotalQuizzes(res.data.data)
    }).catch((err)=>{
      console.log(err);
    })
  }
},[add]);

const removeQuestion = (index, event) => {
  let data = [...quizQuestions];
  data.splice(index, 1);
  setQuizQuestions(data);
};

const getQuestion = (question) => {
  console.log(question)
  quizQuestions.push(question)
  console.log(quizQuestions)
}

const getQuestionFromPool = (question) =>
{
  console.log(question)
  console.log(typeof(question))
  setQuizQuestions([...quizQuestions, ...question]);
  console.log(quizQuestions)
}

const handleQuestionShuffle = (event) =>
{
  if (event.target.checked) {
    setQuestionShuffle(true)
  } else {
    setQuestionShuffle(false)
  }
}

const handleAnswerShuffle = (event) =>
{
  if (event.target.checked) {
    setAnswerShuffle(true)
  } else {
    setAnswerShuffle(false)
  }
}
const handleSeeAnswer = (event) =>
{
  if (event.target.checked) {
    setSeeAnswer(true)
  } else {
    setSeeAnswer(false)
  }
}

const handleCopyQuestion = (event) =>
{
  if (event.target.checked) {
    setCopyQuestion(true)
  } else {
    setCopyQuestion(false)
  }
}

const handleDetectMobile = (event) =>
{
  if (event.target.checked) {
    setDetectMobile(true)
  } else {
    setDetectMobile(false)
  }
}

const saveQuiz = () =>
{
  if(quizQuestions.length == 0 )
  {
    alert('you must add atleast one question')
    setValue('2')
    return
  }
  if(title === '' )
  {
    setValue('1')
    alert('Please add title')
    return
  }
  if(startTime === '' )
  {
    alert('Please assign Start time')
    setValue('1')
    return
  }
  if(endTime === '' )
  {
    alert('Please assign End time')
    setValue('1')
    return
  }
  console.log(quizQuestions)

  let data =  {
    title:title,
    questionShuffle:questionShuffle,
    answerShuffle:answerShuffle,
    seeAnswer:seeAnswer,
    copyQuestion:copyQuestion,
    detectMobile:detectMobile,
    startTime:startTime,
    endTime:endTime,
    questions:quizQuestions,
    userId:user.userInfo.user.id,
    courseId:courseIdredux,
    }
  
  let url="http://localhost:5000/api/quiz/";
      axios.post(url,data,{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}).then((res)=>{
        toast.success('Added', {
          position: toast.POSITION.TOP_CENTER,
        });
        console.log(res)
        console.log('gotres')
      }).catch((err)=>{
        console.log(err)
        toast.error('Failed', {
          position: toast.POSITION.TOP_CENTER,
        });
      })
}

const [quizData,setQuizData] = useState([])
const [quizQuestionsModal,setQuizQuestionsModal] = useState(false)

const handleStartQuiz = (item) =>
{
  console.log(item)
  setQuizData(item)
  setQuizQuestionsModal(true)
}

return (
<div className={styles.main} >
  {(!createQuiz && user.userInfo.user.id == courseClickUserId) && (
    <>
    <div className={styles.container}>
      <button className={styles.button1} onClick={showAddQuiz}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-plus-lg"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"
          />
        </svg>{' '}
        Quiz
      </button>
    </div>

    <div className={styles.quizListMain}>
      <Paper sx={{padding:2}}>

      <div className={styles.headerQuiz}>
          <p>Title</p>
          <p>Actions</p>
      </div>
      {totalQuizzes.map((value,index) => 
      (
        <div className={styles.quizDetails}>
          <div>
          {value.quizTitle}
          </div>
            <div className={styles.footer1}>
                  <button className={styles.edit}>Edit</button>
                  <button className={styles.button0}>Delete</button>
            </div>
        </div>
      )
      )}
      <TablePagination
      />
      </Paper>
    </div>
    
    </>
  )}

    {(!createQuiz && user.userInfo.user.id !== courseClickUserId) && (
    <>
    <div className={styles.quizListMain}>
      <Paper sx={{padding:2}}>

      <div className={styles.headerQuiz}>
          <p>Title</p>
          <p>Actions</p>
      </div>
      {totalQuizzes.map((value,index) => 
      (
        <div className={styles.quizDetails}>
          <div>
          {value.quizTitle}
          </div>
            <div className={styles.footer1}>
                  <Button variant="contained" disabled={false} onClick={() =>handleStartQuiz(value)}>Start</Button>
            </div>
        </div>
      )
      )}
      <TablePagination/>
      </Paper>
    </div>

    {quizQuestionsModal && <DisplayQuiz data={quizData} handleStartQuiz={setQuizQuestionsModal}/>}


    
    </>
  )}

  {createQuiz && (
    <div>
      <Box sx={{ width: '100%' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Detials" value="1" />
              <Tab label="Questions" value="2" />
            </Tabs>
          </Box>

          <TabPanel value="1" index={0}>
            <TextField
              id="outlined-basic"
              label="Quiz Title"
              variant="outlined"
              sx={{ marginLeft: '-22px', marginTop: '10px' }}
              size="small"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <p className={styles.instructions}>
              <b>Quiz Instructions:</b>
            </p>
            <div class={styles.infolist}>
              <div className={styles.info}>
                1. You will have only <em>{time} seconds&nbsp;</em> per each
                question.
              </div>
              <div className={styles.info}>
                2. Once you select your answer, it can't be undone.
              </div>
              <div className={styles.info}>
                3. You can't select any option once time goes off.
              </div>
              <div className={styles.info}>
                4. You can't exit from the Quiz
              </div>
              <div className={styles.info}>
                5. A complete quiz log will be created of your activities
              </div>
            </div>

            <p className={styles.instructions}>
              <b>Options</b>
            </p>


            <Stack component="form" noValidate spacing={2}>
              <TextField
                id="datetime-local"
                label="Start Time"
                type="datetime-local"
                size='small'
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                // defaultValue="2017-05-24T10:30"
                sx={{ width: 250}}
                InputLabelProps={{
                  shrink: true,
                }}
                />

              <TextField
              id="datetime-local"
              label="End Time"
              size='small'
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              sx={{ width: 250}}
              InputLabelProps={{
                shrink: true,
              }}
            />
            </Stack>


            <div className={styles.Options}>
              <input
                type="number"
                id="quantity"
                className={styles.input}
                name="quantity"
                defaultValue={time}
                onChange={(e) => {
                  setTime(e.target.value);
                }}
                min="1"
                max="100"
              ></input>
              <p>seconds per question</p>
            </div>

            <div className={styles.Options1}>
              <input type="checkbox" name="checkbox-1" id="checkbox-1" onChange={handleCopyQuestion} />
              <label for="checkbox-1">
                Do not allow Students to copy question text
              </label>
            </div>

            <div className={styles.Options1}>
              <input type="checkbox" name="checkbox-1" id="checkbox-1" onChange={handleQuestionShuffle} />
              <label for="checkbox-1">Shuffle Questions</label>
            </div>

            <div className={styles.Options1}>
              <input type="checkbox" name="checkbox-1" id="checkbox-1" onChange={handleAnswerShuffle}/>
              <label for="checkbox-1">Shuffle Answers</label>
            </div>

            <div className={styles.Options1}>
              <input type="checkbox" name="checkbox-1" id="checkbox-1" onChange={handleSeeAnswer} />
              <label for="checkbox-1">
                Let Students See Correct Answer
              </label>
            </div>

            <div className={styles.Options1}>
              <input type="checkbox" name="checkbox-1" id="checkbox-1" onChange={handleDetectMobile}/>
              <label for="checkbox-1">Detect Mobile</label>
            </div>
          </TabPanel>

          <TabPanel value="2" index={1}>
          {(quizQuestions.length == 0 && !add)&& <p className={styles.empty}>No questions yet</p>}



          {quizQuestions.map((item,index) => {
            return(<div className={styles.questions}>
              
              <div className={styles.head}>
              pts/time
              </div>
              <div className={styles.body}>
                  <div>
                  {item.question}
                  </div>
                  <div>
                  <i class="bi bi-pencil" style={{color:'blue',width:"8px",height:"8px",fontSize:'16px',verticalAlign:'.26em',marginRight:'8px'}}></i>
                  <svg
                    onClick={() => removeQuestion(index)}
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="red"
                    class="bi bi-trash3"
                    viewBox="0 0 16 16"
                  >
                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                  </svg>

                  </div>
              </div>

              </div>   )})}  
            
            {add && <CreateQuestion close={setAdd} time={time}  getQuestion={getQuestion}/>}
            {importPool && <ImportPool close={setImportPool} getQuestion={getQuestionFromPool}/>}


            <div className={styles.buttonContainer1}>
              <button
                className={styles.cancel}
                onClick={() => setAdd(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-plus-lg"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"
                  />
                </svg>
                New Question
              </button>
              <button className={styles.cancel} onClick={() => setImportPool(true)}>
                <i class="bi bi-search"></i>Find Questions
              </button>
            </div>

          </TabPanel>
        </TabContext>
      </Box>

      <hr className={styles.hr}></hr>
      <div className={styles.buttonContainer}>
        <button onClick={showMainQuiz} className={styles.cancel}>
          Cancel
        </button>
        <button onClick={saveQuiz} className={styles.save}>
          Save
        </button>
      </div>
      <hr></hr>
    </div>
  )}
</div>
  );
}

export default Quiz;
