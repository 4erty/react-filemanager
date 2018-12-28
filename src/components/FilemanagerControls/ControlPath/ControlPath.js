import React from 'react';
import styles from './ControlPath.css';

const ControlPath = ({ path })=>(
  <div className={styles.ControlPath}>
    <span>{`Текущий путь: ${path || '/'}`}</span>
  </div>
);

export default ControlPath;
