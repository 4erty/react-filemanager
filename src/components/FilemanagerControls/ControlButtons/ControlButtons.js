import React from 'react';
import styles from './ControlButtons.css';

import Button from '../../UI/Button/Button';
import UploadButton from '../../UI/UploadButton/UploadButton';

const ControlButtons = ({
  createFolder,
  pasteFiles,
  pasteDisable,
  upload,
}) => {
  return (
    <div className={styles.ControlButtons}>
      <Button clicked={createFolder}>Создать папку</Button>
      <Button disabled={pasteDisable} clicked={pasteFiles}>Вставить</Button>
      <UploadButton clicked={upload}>Загрузить файл</UploadButton>
    </div>
  );
};

export default ControlButtons;
