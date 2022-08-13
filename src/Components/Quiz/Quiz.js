import styles from './Quiz.module.css'

import React, { useState } from 'react'
import CreateQuiz from './CreateQuiz'




function Quiz() {
const [createQuiz,setCreateQuiz] = useState(false)

function showAddQuiz()
{
    setCreateQuiz(true)
}

function showMainQuiz()
{
    setCreateQuiz(false)
}

  return (
    <div className={styles.main}>
        {!createQuiz && <div className={styles.container}>
            <button className={styles.button} onClick={showAddQuiz}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/></svg> Quiz</button>
        </div>}

        {createQuiz && 
        <div>
            <h1>Hello</h1>
            <div>

                <button onClick={showMainQuiz}> Cancel</button>
            </div>
        </div>
        }
    </div>
  )
}

export default Quiz