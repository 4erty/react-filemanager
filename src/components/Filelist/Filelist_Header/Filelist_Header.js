import React from 'react';
import styles from './Filelist_Header.css';

const FilelistHeader = (props)=>{
  const headers = Array.isArray(props.headers)
    ? props.headers.map(
      (header, ind) => <th key={ind} className={styles.Filelist_Header_Cell}>{header}</th>,
    )
    : null;

  return (
  <thead className={styles.Filelist_Header}>
    <tr>
      {headers}
    </tr>
  </thead>
  );
};

export default FilelistHeader;
