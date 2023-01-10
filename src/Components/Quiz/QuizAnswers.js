import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import styles from './QuizAnswers.module.css'

function QuizAnswers() {
    const location = useLocation()
    const [data, setData] = useState(location.state.data)
    console.log(location.state.data);
    return (
        <div className={styles.Main}>
            <h1 className={styles.hahah}>{location.state.name} </h1>
            {data.map((value, index) => {
                return (
                    <>
                        <div className={styles.Head}>
                            <div className='mb-[10px]'><b>{index + 1}. {value.question}</b></div>
                            <p className={styles.p}>Correct Option : &nbsp;<span>{value.correctOption}</span></p>
                            <p className={styles.p}>Selected Option : &nbsp;<span style={value.correctOption === value.selectedOption ? { color: '#3CCF4E' } : { color: 'red' }}>{value.selectedOption}</span></p>
                        </div>
                        {index + 1 !== data.length && <hr></hr>}
                    </>
                )
            })}

        </div>
    )
}

export default QuizAnswers