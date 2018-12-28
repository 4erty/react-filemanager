import React, { Component } from 'react';
import styles from './App.css';

import Filemanager from '../Filemanager/Filemanager';

class App extends Component {
  render() {
    return (
      <div className={styles.App}>
        <Filemanager />
      </div>
    );
  }
}

export default App;
