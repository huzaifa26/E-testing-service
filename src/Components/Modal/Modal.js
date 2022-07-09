import React from 'react'
import styles from './Modal.module.css'
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import {useCookies} from "react-cookie";
import {courseJoinActions} from "./../../Redux/course-slice";
import { useSelector,useDispatch } from 'react-redux';


function getTime() {
  var date = new Date()
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString();
  }

let yourDate=getTime();
yourDate=yourDate.toString().split("T");
yourDate[1]=yourDate[1].toString().split(".")[0];
yourDate=yourDate.toString().replaceAll(","," ");

function Modal({closeModal}) {
  const [cookie,setCookie]=useCookies();
  const dispatch=useDispatch();
  const courseJoin=useSelector(state=> state.courseJoin);
  const user=useSelector(state=> state.user);

  

    const formik = useFormik({
      initialValues: {
        joiningkey: '',
        confirmjoiningkey: '',
      },
      validationSchema: Yup.object({
        joiningkey: Yup.string().required('Joining Key is required'),
        confirmjoiningkey: Yup.string().oneOf(
          [Yup.ref('joiningkey'), null],
          'Join key  must match'
        ),
      }),
      onSubmit: (values, { resetForm }) => {

        let data={
          userId:user.userInfo.user.id,
          joiningkey:values.joiningkey,
          joinTime:yourDate
      }
        axios.post('http://localhost:5000/api/joinCourse', data,{
            joiningkey: values.joiningkey,
          })
          .then(function (response) {
            if (response.status === 200)
            {
              toast.success('Joined', {
                position: toast.POSITION.TOP_RIGHT,
              });
              axios.get("http://localhost:5000/api/joinedCourses/"+user.userInfo.user.id,{withCredentials:true},{headers: { Authorization: `Bearer ${cookie.token}`}}
              ).then((res)=>{
                console.log(res);
                dispatch(courseJoinActions.joinedCourses(res.data.data));
                console.log(courseJoin.joinedCourses)
                
              }).catch((err)=>{
                console.log(err);
              })
            }
            if (response.response.status === 400)
            {
              toast.error('Wrong Key', {
                position: toast.POSITION.TOP_RIGHT,
              });
            }
            if (response.response.status === 401)
            {
              toast.error('You have already joined this class', {
                position: toast.POSITION.TOP_RIGHT,
              });
            }
                 
          })
          .catch(function (error) {
            console.log(error)
            });
      },
    });
  

  return (
    <>
    <div className={styles.modalBackground}></div>
        <form className={styles.modalContainer} onSubmit={(e) => {e.preventDefault();formik.handleSubmit();}}>
          <h1 className={styles.h1}>Join Class</h1>
          <div className={styles.fieldMain}>

          <div className={styles.field}>
            <input
              type="text"
              id="joiningkey"
              placeholder="Joining Key"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.joiningkey}
              />
            {formik.touched.joiningkey && formik.errors.joiningkey ? (
              <p>{formik.errors.joiningkey}</p>
              ) : null}
          </div>

          <div className={styles.field}>
            <input
              id="confirmjoiningkey"
              type="text"
              placeholder="Confirm Joining Key"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmjoiningkey}
            />
            {formik.touched.confirmjoiningkey && formik.errors.confirmjoiningkey ? (
              <p>{formik.errors.confirmjoiningkey}</p>
            ) : null}
          </div>

          </div>
            <div className={styles.footer}>
                <button onClick={() => closeModal(false)}>Cancel</button>
                <button type='submit'>Join</button>
            </div>
        </form>
        </>
  )
}

export default Modal