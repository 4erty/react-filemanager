import React from 'react';
import { formatDate, formatFilsize } from '../../../../utils/utils';

import styles from './Filelist_Row.css';

import FolderSolid from '../../../SVG/Icons/FolderSolid/FolderSolid';
import FileRegular from '../../../SVG/Icons/FileRegular/FileRegular';
import FileImage from '../../../SVG/Icons/FileImage/FileImage';
import FilePdf from '../../../SVG/Icons/FilePdf/FilePdf';

const FilelistRow = (props) => {
  const file = props.file;
  let icon = <FileRegular width='16px' height='16px' />;
  if (file.directory === true) icon = <FolderSolid width='16px' height='16px' color='rgb(236, 218, 130)'/>;
  if (file.mimeType && file.mimeType.indexOf('image') !== -1) icon = <FileImage width='16px' height='16px' />;
  if (file.mimeType && file.mimeType === 'application/pdf') icon = <FilePdf width='16px' height='16px' />;

  return (
    <tr className={styles.Filelist_Row} onClick={props.selectRow}>
      <td className={styles.Filelist_Row_Cell}>
        <div className={file.directory === true ? styles.dir : styles.file}>
          {icon}
          {file.directory === true ? file.name : `${file.name}.${file.extension}`}
        </div>
      </td>
      <td className={styles.Filelist_Row_Cell}>
        {file.directory !== true ? formatFilsize(file.size) : null}
        </td>
      <td className={styles.Filelist_Row_Cell}>{formatDate(file.created)}</td>
      <td className={styles.Filelist_Row_Cell}>{formatDate(file.modified)}</td>
    </tr>
  );
};

export default FilelistRow;
