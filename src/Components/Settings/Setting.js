import React, { useCallback } from 'react'
import styles from './Setting.module.css'
import { useState, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import { Storage } from '../../Utils/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useCookies } from 'react-cookie';
import TextField from '@mui/material/TextField';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import ConfirmDelete from './ConfirmDelete';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

function Setting() {

    const navigate = useNavigate()
    const courseIdredux = useSelector(state => state.getCourseIdOnClick.getCourseIdOnClick);
    const [courseInfo, setCourseInfo] = useState([])
    const [cookie, setCookie] = useCookies();
    const [courseName, setCourseName] = useState("");
    const [courseDescription, setCourseDescription] = useState("")
    const [image, setImage] = useState('');
    const [imageURL, setImageURL] = useState('')

    const [confirmDelete, setConfirmDelete] = useState(false)
    const [triggerKey, setTriggerKey] = useState(false)


    const imageHandler = async (e) => {
        setImage(e.target.files[0]);

        if (image == null)
            return;

        const storageRef = ref(Storage, `/courseImages/${e.target.files[0].name}`);
        const uploadTask = await uploadBytes(storageRef, e.target.files[0]);

        getDownloadURL(ref(Storage, `/courseImages/${e.target.files[0].name}`)).then((url) => {
            console.log(url);
            setImageURL(url);
        });
    }

    const manageStudents = () => {
        navigate('/courses/manangeStudents')
    }

    const handleSave = () => {
        let data = {
            id: courseInfo[0]?.id,
            courseName: courseName,
            courseDescription: courseDescription,
            imageUrl: imageURL
        }
        console.log(data)

        axios.post("http://localhost:5000/api/updateSetting", data, { withCredentials: true }).then((res) => {
            if (res.status === 200) {
                toast.success('Setting Updated', { position: toast.POSITION.TOP_RIGHT, });
            }
            console.log(res)
        }).catch((err) => {
            console.log(err);
        })
    }

    const changeKey = () => {
        axios.post("http://localhost:5000/api/changeKey", { courseIdredux }, { withCredentials: true }).then((res) => {
            if (res.status === 200) {
                toast.success('Course Key Changed', { position: toast.POSITION.TOP_RIGHT, });
            }
            console.log(res)
            setTriggerKey((state) => !state)
        }).catch((err) => {
            console.log(err);
        })
    }

    useEffect(() => {
        axios.get("http://localhost:5000/api/courseSetting/" + courseIdredux, { withCredentials: true }, { headers: { Authorization: `Bearer ${cookie.token}` } }
        ).then((res) => {
            setCourseInfo(res.data.data)
            setCourseName(res.data.data[0]?.courseName)
            setCourseDescription(res.data.data[0]?.courseDescription)
            setImageURL(res.data.data[0]?.imageUrl)
        }).catch((err) => {
            console.log(err);
        })
    }, [triggerKey])

    return (
        <div className={styles.Main}>

            <div className={styles.header}>

                <div className={styles.left}>
                    <div className={styles.one}>
                        <div className={styles.imgTitle}>
                            <label>Image:</label>
                        </div>

                        <div className={styles.titles}>
                            <label>Name:</label>
                        </div>

                        <div className={styles.titles}>
                            <label>Key:</label>
                        </div>

                        <div className={styles.titles}>
                            <label>Description:</label>
                        </div>
                    </div>

                    <div className={styles.two}>
                        <div >
                            <div className={styles.ImageContainer}>
                                <img src={imageURL === '' ? courseInfo[0]?.imageUrl : `${imageURL}`} />
                                <div className={styles.chooseImg}>
                                    <button className="button" onClick={imageHandler}><label for="files" class="btn">Change</label></button>
                                    <input onChange={imageHandler} id="files" style={{ visibility: "hidden" }} type="file" accept="image/png, image/gif, image/jpeg" />
                                </div>
                            </div>
                        </div>

                        <div className={styles.imageDetails}>
                            <TextField id="outlined-basic" value={courseName} onChange={(e) => setCourseName(e.target.value)} variant="outlined" className={styles.inputMui} size="small" required />
                        </div>
                        <div style={{ display: 'flex' }} className={styles.imageDetails}>
                            <TextField disabled id="outlined-basic" value={courseInfo[0]?.courseKey} variant="outlined" size="small" className={styles.inputMui} required />
                            <div title='Change Course Key' onClick={changeKey}>
                                <span className={styles.aaas} >

                                    <KeyIcon style={{ height: '20px', marginTop: '10px', marginLeft: '10px' }} />
                                </span>

                            </div>
                        </div>
                        <div className={styles.imageDetails}>
                            <TextareaAutosize
                                className={styles.bb}
                                aria-label="empty textarea"
                                placeholder="Empty"
                                minRows={8}
                                value={courseDescription}
                                onChange={(e) => setCourseDescription(e.target.value)}
                                style={{ width: '80%', minWidth: '200px' }}
                            />

                        </div>
                    </div>

                </div>

                <div className={styles.three}>

                    <div className={styles.list} onClick={() => setConfirmDelete(true)}>
                        {/* <DeleteIcon style={{ height:'20px' }} /> */}
                        {/* <p> Delete this course</p> */}
                        <Button sx={{ backgroundColor: 'red', color: 'white' }} variant="raised">Delete Course</Button>

                    </div>
                    {/* <hr className={styles.hr2}></hr> */}

                </div>

            </div>

            <div className={styles.footer}>
                <div className={styles.buttonContainer}>
                    {/* <button  className={styles.save} >
            Update Course Detials
            </button> */}
                    <Button variant="contained" className='button' onClick={handleSave}>Update Course Detials</Button>
                </div>
            </div>

            {confirmDelete && <ConfirmDelete close={setConfirmDelete} />}
        </div>

    )
}

export default Setting