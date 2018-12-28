import React from 'react';
import styles from './ControlButtons.css';

import Button from '../../UI/Button/Button';

const ControlButtons = (props)=>(
  <div className={styles.ControlButtons}>
    <Button clicked={props.createFolder}>Создать папку</Button>
    <Button disabled>Вставить</Button>
    <Button disabled>Загрузить файл</Button>
  </div>
);

export default ControlButtons;
