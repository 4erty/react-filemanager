import React from 'react';
import style from './Filelist_Body.css';

import FilelistRow from './Filelist_Row/Filelist_Row';

const FilelistBody = ({
  files,
  select,
  selected,
  context,
  fancy,
}) => {
  let list = null;
  if (Array.isArray(files)) {
    list = files.map((file, index) => (
      <FilelistRow
        key={index}
        file={file}
        select={select}
        selected={selected.indexOf(index) !== -1}
        context={context}
        fancy={fancy}
      />
    ));
  }

  return <tbody className={style.Filelist_Body}>{list}</tbody>;
};

export default FilelistBody;
