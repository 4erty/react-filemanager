import React, { Component } from 'react';
import styles from './Filelist.css';

import FilelistHeader from './Filelist_Header/Filelist_Header';
import FilelistBody from './Filelist_Body/Filelist_Body';

const h = 'Название_Размер_Создан_Изменен'.split('_');
const sort = (a, b) => a.name > b.name ? 1 : -1;

class Filelist extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const dirs = this.props.files.filter(el=>el.directory === true).sort(sort);
    const files = this.props.files.filter(el=>el.directory !== true).sort(sort);
    return (
      <table className={styles.Filelist}>
        <FilelistHeader headers={h}/>
        <FilelistBody files={dirs.concat(files)}/>
      </table>
    );
  }
}

export default Filelist;
