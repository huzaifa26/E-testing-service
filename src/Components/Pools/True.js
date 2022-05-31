import React, { useState } from 'react';
import styles from './True.module.css';

function True(props) {
  const [value, setvalue] = useState('');

  const handleTrues = () => {
    let truesData = {
      options: ['True', 'False'],
      correctAnswer: value,
      questionType: 'TRUE/FALSE',
    };
    props.sendTrues(truesData);
  };

  return (
    <>
      <div className={styles.true}>
        <label>
          True &nbsp;&nbsp;
          <input
            type="radio"
            name="isTrue"
            value="true"
            onClick={(e) => {
              setvalue(e.target.value);
            }}
          />
          &nbsp;&nbsp;&nbsp;&nbsp;
        </label>
        <label>
          False &nbsp;&nbsp;
          <input
            type="radio"
            name="isTrue"
            value="false"
            onClick={(e) => {
              setvalue(e.target.value);
            }}
          />
          &nbsp;&nbsp;&nbsp;&nbsp;
        </label>
      </div>
      <div className={styles.buttoncenter}>
        <button className={styles.button} onClick={handleTrues}>
          Submit
        </button>
      </div>
    </>
  );
}

export default True;
