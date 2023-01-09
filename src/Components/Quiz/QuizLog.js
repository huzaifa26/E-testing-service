import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import styles from './QuizLog.module.css'

function QuizLog() {
    const location = useLocation()
    console.log(location.state.data);
    const [data, setData] = useState(location.state.data)

    return (
        <div className={styles.Main}>
            <h1 className={styles.hahah}>{location.state.name} </h1>
            {data.map((value, index) => {
                return (
                    <>
                        <div className={styles.Head}>
                            <div className='mb-[10px]'>{index + 1}. Focus lost on<b> {value.lostFocusTime}</b></div>
                        </div>
                        {index + 1 !== data.length && <hr></hr>}
                    </>
                )
            })}

        </div>
    )
}

export default QuizLog