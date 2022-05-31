import styles from './Pools.module.css';

import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import ShowPool from './ShowPool';
import Buildpool from './Buildpool';

function Pools() {
  const [showPool, setshowPool] = useState(true);
  const [createPool, setcreatePool] = useState(false);

  return (
    <div>
      <Navbar />
      <div className={styles.pool}>
        <div className={styles.intro}>
          <h1>Pools</h1>
          <p>
            Pool is a collection of questions that is stored for repeated use.
          </p>
        </div>
        <div className={styles.poolsBar}>
          <button
            className={styles.button0}
            onClick={() => {
              setshowPool(true);
              setcreatePool(false);
            }}
          >
            Show Pool
          </button>
          <button
            className={styles.button2}
            onClick={() => {
              setshowPool(false);
              setcreatePool(true);
            }}
          >
            Create Pool
          </button>
          {/* <span className={styles.span2}>Import Pool</span> */}
          {showPool && <ShowPool />}
          {createPool && <Buildpool />}
        </div>
      </div>
    </div>
  );
}

export default Pools;
