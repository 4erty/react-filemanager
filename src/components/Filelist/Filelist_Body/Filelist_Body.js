import React from 'react';
import style from './Filelist_Body.css';

import FilelistRow from './Filelist_Row/Filelist_Row';

const selectRow = (event) => {
  event.currentTarget.classList.toggle('selected');
};

const FilelistBody = (props) => {
  let list = null;
  if (Array.isArray(props.files)) {
    list = props.files.map((file, index) => (
      <FilelistRow
        key={index}
        file={file}
        selectRow={selectRow}
      />
    ));
  }

  return <tbody className={style.Filelist_Body}>{list}</tbody>;
};

export default FilelistBody;
