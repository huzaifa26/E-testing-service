import { TextareaAutosize, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import styles from './BuildQuestion.module.css'
import LoadingButton from '@mui/lab/LoadingButton';
import { styled } from '@mui/material/styles';
// import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';
import { fontSize } from '@mui/system';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useSelector } from 'react-redux';


function BuildQuestion({ close, getQuestion }) {
    const [loading, setLoading] = useState(false);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [sentence, setSentence] = useState("")
    const [questions, setQuestions] = useState([])
    const [showQuestions, setShowQuestions] = useState(false)
    const [addQuestions, setAddQuestions] = useState([])
    const [changeQuestion, setChangeQuestion] = useState(false)
    const user = useSelector(state => { return state.user; })
    const courseIdredux = useSelector(state => state.getCourseIdOnClick.getCourseIdOnClick);

    const ColorButton = styled(LoadingButton)(({ theme }) => ({
        color: theme.palette.getContrastText('#ff4b2b'),
        backgroundColor: '#ff4b2b',
        borderRadius: '2px',
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#ffffff',
        cursor: "pointer",
        padding: "8px 20px",
        letterSpacing: "1px",
        marginTop: '8px',
        textTransform: "uppercase",
        transition: "transform 80ms ease-in",
        '&:hover': {
            backgroundColor: '#ff4b2b',
        },

    }));

    const handleSentence = () => {

        if (!showQuestions) {
            setLoading(true)
            if (sentence === "") {
                // setLoading(false)
                toast.error('Enter some text', {
                    position: toast.POSITION.TOP_CENTER,
                });
            }
            else {
                setTimeout(function () {
                    let data = {
                        sentence: sentence
                    }
                    axios.post("http://127.0.0.1:8000/question-generation/", data)
                        .then((res) => {
                            setLoading(false)
                            const arr = []

                            Object.keys(res.data.questions).forEach(
                                key =>
                                    arr.push({
                                        index: key,
                                        question: res.data.questions[key],
                                        correctOption: "",
                                        points: 5,
                                        time: 60,
                                        questionImage: null,
                                        questionType: 'Subjective',
                                        options: [],
                                        courseId: courseIdredux,
                                        userId: user.userInfo.user.id,
                                        isMathJax: false
                                    })
                            )

                            setQuestions([...arr])
                            setShowQuestions(true)
                        }).catch((err) => {
                            console.log(err);
                        })
                }, 1000);
            }
        }
        else if (showQuestions && !changeQuestion) {
            if (addQuestions.length === 0) {
                toast.error('Please select atleast one question', {
                    position: toast.POSITION.TOP_CENTER,
                });

            }
            else {
                setChangeQuestion(true)
            }

        }
        else {
            let abc = true
            let abc2 = true
            let abc3 = true
            addQuestions.forEach((val, index) => {
                if (val.correctOption === '') {
                    toast.error(`Please provide answer of ${index + 1} question`, {
                        position: toast.POSITION.TOP_CENTER,
                    });
                    abc = false
                    return
                }
                else {
                    abc = true
                    return
                }
            })
            addQuestions.forEach((val, index) => {
                if (val.points === '') {
                    toast.error(`Please provide points of ${index + 1} question`, {
                        position: toast.POSITION.TOP_CENTER,
                    });
                    abc2 = false
                    return
                }
                else {
                    abc2 = true
                    return
                }
            })
            addQuestions.forEach((val, index) => {
                if (val.time === '') {
                    toast.error(`Please provide time of ${index + 1} question`, {
                        position: toast.POSITION.TOP_CENTER,
                    });
                    abc3 = false
                    return
                }
                else {
                    abc3 = true
                    return
                }
            })
            if (abc === true && abc2 === true && abc3 === true) {
                getQuestion(addQuestions);
                close(false)
            }
        }
    }



    const handler = (value) => {
        if (addQuestions.includes(value)) {
            var newArr = addQuestions.filter((val) => val !== value).map((val2) => { return val2 })
            setAddQuestions([...newArr])
        }
        else {
            setAddQuestions([...addQuestions, value])
        }

    }

    const handleSec = (e, index) => {
        let newArr = [...addQuestions]
        newArr[index].time = e.target.value
        setAddQuestions([...newArr])

    }

    const handlePoint = (e, index) => {
        let newArr = [...addQuestions]
        newArr[index].points = e.target.value
        setAddQuestions([...newArr])
    }

    const handleText = (e, index) => {
        let newArr = [...addQuestions]
        newArr[index].correctOption = e.target.value
        setAddQuestions([...newArr])
    }

    return (
        <>
        <div className={styles.modalBackground} onClick={() => close(false)}></div>
            <div className={`${styles.modalContainer} divide-y-2`}>
                <h1>Generate Questions</h1>
                <div className={styles.Main2}>
                    {!showQuestions && <textarea
                        name=""
                        id=""
                        cols="75"
                        rows="17"
                        placeholder="Enter your paragraph here..."
                        className={styles.textarea}
                        value={sentence}
                        onChange={(e) => setSentence(e.target.value)}
                    ></textarea>}
                    {(showQuestions && !changeQuestion) &&
                        <div className={styles.questionMain}>
                            {questions.map((value, index) => {
                                return (
                                    <div className={styles.questionSub}>
                                        <input type='checkbox' onChange={() => handler(value)} />
                                        <p>{value.question}</p>
                                    </div>
                                )
                            })}
                        </div>
                    }
                    {changeQuestion &&
                        addQuestions.map((value, index) => {
                            return (
                                <div className={styles.holder}>
                                    <div className={styles.header}>
                                        <div className={styles.select}>
                                            <select >
                                                <option value="1" selected>Subjective Question</option>
                                            </select>
                                        </div>

                                        <div className={styles.second}>
                                            <div className={styles.Options}>
                                                <p>sec:</p>
                                                <input type="number" id="quantity" className={styles.input} name="quantity" defaultValue={value.time} onChange={(e) => handleSec(e, index)} min="1" max="100"></input>
                                            </div>
                                            <div className={styles.Options}>
                                                <p>pts:</p>
                                                <input type="number" id="quantity" className={styles.input} name="quantity" defaultValue={value.points} onChange={(e) => handlePoint(e, index)} min="1"></input>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.addQuestion}>

                                        <div>
                                            <p className={styles.p1}>Question:</p>
                                            <em>{value.question}</em>
                                        </div>

                                        <div>
                                            <p className={styles.p1}>Answers:</p>
                                        </div>

                                        <>
                                            <textarea
                                                className={styles.text}
                                                placeholder="Enter your answer here..."
                                                onChange={(e) => handleText(e, index)}
                                            ></textarea>
                                        </>
                                    </div>

                                </div>
                            )
                        })
                    }
                </div>
                <div className={styles.next}>
                    <ColorButton
                        type='submit'
                        endIcon={< ArrowForwardIcon style={{ fontSize: "14px" }
                        } />}
                        loading={loading}
                        loadingPosition="center"
                        variant="contained"
                        onClick={handleSentence}
                        className="button"
                    >
                        Next
                    </ColorButton>
                </div>

            </div>
        </>
    )
}

export default BuildQuestion