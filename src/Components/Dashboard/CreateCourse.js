import styles from "./CreateCourse.module.css";
import { useRef } from "react";
import axios from "axios";
import { Storage } from "../../Utils/firebase";
import { useState } from "react";
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage"
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { courseActions } from "./../../Redux/course-slice";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';


const CreateCourse = (props) => {
  const user = useSelector(state => { return state.user; })
  const [cookie, setCookie] = useCookies();
  const [image, setImage] = useState('');
  const [imageURL, setImageURL] = useState('https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/cb/3c4030d65011e682d8b14e2f0915fa/shutterstock_226881610.jpg?auto=format%2Ccompress&dpr=1');
  const formRef = useRef();
  const navigate = useNavigate()
  const [file, setfile] = useState('');


  const CreateClassSubmithandler = (e) => {
    e.preventDefault();

    function getTime() {
      var date = new Date()
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      return date.toISOString();
    }
    let yourDate = getTime();
    yourDate = yourDate.toString().split("T");
    yourDate[1] = yourDate[1].toString().split(".")[0];
    yourDate = yourDate.toString().replaceAll(",", " ");

    console.log(user);

    let data = {
      userId: user.userInfo.user.id,
      imageUrl: imageURL,
      courseName: formRef.current.courseName.value,
      description: formRef.current.description.value,
      createTime: yourDate,
    }
    axios.post("http://localhost:5000/api/courses", data, { withCredentials: true }).then((res) => {
      console.log(res);
      if (res.status === 200) {
        toast.success('Course Created Succesfully', {
          position: toast.POSITION.TOP_RIGHT,
        });
        navigate('/dashboard')
      }
    }).catch((err) => {
      if (err.status === 500) {
        toast.error('Cannot register Course', {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    })
  }


  const fileHandler = async (e) => {
    setImage(e.target.files[0]);
    const last_dot = e.target.files[0].name.lastIndexOf('.')
    const ext = e.target.files[0].name.slice(last_dot + 1)
    const name = e.target.files[0].name.slice(0, last_dot)


    if (file == null)
      return;

    console.log(file);
    toast(0, { autoClose: false, toastId: 1 })

    try {
      console.log("uploading")
      const storageRef = ref(Storage, `/courseImages/${e.target.files[0].name}`);
      const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);
      console.log("uploaded");
      uploadTask.on('state_changed',
        (snapshot) => {
          const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          toast.update(1, {
            // position: toast.POSITION.TOP_CENTER,
            render: 'Uploading ' + p.toFixed(0) + '%',
          });
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setImageURL(url);
            toast.update(1, {
              type: toast.TYPE.SUCCESS,
              render: 'File uploaded',
              autoClose: 1000
            });
          });
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className={styles.CreateCourse}>


      <div className={styles.joinedHeader2}>
        <form ref={formRef} onSubmit={CreateClassSubmithandler} className={styles.form}>
          <div className={styles.imageContainer}>
            <div className={styles.joinss}>
              <img src={imageURL === "" ? "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/cb/3c4030d65011e682d8b14e2f0915fa/shutterstock_226881610.jpg?auto=format%2Ccompress&dpr=1" : imageURL}></img>
              <div style={{ marginLeft: '6.541vw', marginTop: '10px' }}>
                <label for="files" class="btn">Change Image</label>
                <input accept=".png,.jpg,.jpeg" onChange={fileHandler} id="files" style={{ visibility: "hidden" }} type="file" />
              </div>
            </div>

          </div>
          {/* <input required name="courseName"  placeholder="Class Name"></input> */}
          <TextField className={styles.Textfield} name="courseName" type={"text"} id="outlined-basic" label="Class Name" variant="outlined" sx={{ width: 'auto' }} size="medium" required />

          <textarea required style={{ resize: 'none', width: '100%', fontSize: '18px', borderRadius: "4px", padding: '10px' }} name="description" rows='10' type={"text"} placeholder="Description"></textarea>

          <div className={styles.button}>
            <button type="submit">Create Class</button>
          </div>
        </form>
      </div>
    </div>);
}

export default CreateCourse;