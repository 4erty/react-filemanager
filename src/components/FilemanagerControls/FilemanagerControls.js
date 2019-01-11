import React from 'react';
import styles from './FilemanagerControls.css';

import ControlButtons from './ControlButtons/ControlButtons';
import ControlPath from './ControlPath/ControlPath';

const FilemanagerControls = ({
  createFolder,
  pasteFiles,
  pasteDisable,
  upload,
  path,
})=>(
  <div className={styles.FilemanagerControls}>
    <ControlButtons
      createFolder={createFolder}
      pasteFiles={pasteFiles}
      pasteDisable={pasteDisable}
      upload={upload}
    />
    <ControlPath path={path}/>
  </div>
);

export default FilemanagerControls;
