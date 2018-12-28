import React from 'react';
import styles from './FilemanagerControls.css';

import ControlButtons from './ControlButtons/ControlButtons';
import ControlPath from './ControlPath/ControlPath';

const FilemanagerControls = (props)=>(
  <div className={styles.FilemanagerControls}>
    <ControlButtons createFolder={props.createFolder}/>
    <ControlPath />
  </div>
);

export default FilemanagerControls;
