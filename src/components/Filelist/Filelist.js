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
    return (
      <table className={styles.Filelist}>
        <FilelistHeader headers={h}/>
        <FilelistBody
          files={this.props.files}
          select={this.props.select}
          selected={this.props.selected}
          context={this.props.context}
          fancy={this.props.fancy}
        />
      </table>
    );
  }
}

export default Filelist;
