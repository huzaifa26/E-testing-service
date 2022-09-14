import React, { useState } from 'react';
import styles from './True.module.css';

function True(props) {
  const [value, setvalue] = useState('');

  const handleTrues = () => {
    let truesData = {
      options: ['True', 'False'],
      correctOption: value,
      questionType: 'TRUE/FALSE',
    };
    props.getTrues(truesData);
  };

  return (
    <>
      <div className={styles.true}>
        <label>True 
          <input type="radio" name="isTrue" value="true"
            onClick={(e) => {
              setvalue(e.target.value);
            }}
          />
        </label>
        <label>False 
          <input type="radio" name="isTrue" value="false"
            onClick={(e) => {
              setvalue(e.target.value);
            }}
          />
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
