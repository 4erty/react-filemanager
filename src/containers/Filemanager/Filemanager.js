import React, { Component } from 'react';
import styles from './Filemanager.css';
import { dirUrl } from './config';

import Filelist from '../../components/Filelist/Filelist';
import FilemanagerControls from '../../components/FilemanagerControls/FilemanagerControls';
import Dialog from '../../components/UI/Dialog/Dialog';

class Filemanager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: null,
      files: [],
      createFolder: false,
    };
    this.createFolderModal = this.createFolderModal.bind(this);
    this.createFolder = this.createFolder.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    fetch(dirUrl)
      .then(response => {
        return response.json();
      })
      .then(json => {
        this.setState(() => {
          return {
            files: json.data,
          };
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  // open Dialog for enter folder name
  createFolderModal() {
    this.setState({ createFolder: true });
  }

  // run create folder, afeter clieck ok in Dialog
  createFolder(name) {
    console.log(name);
    // check duplicate folder name
    let dublicate = this.state.files.find(file => file.directory === true && file.name === name);
    if (dublicate !== undefined) {
      this.setState({ error: 'Каталог с тиким именем уже существует' });
      return;
    }
    // check valid symbols
    if (name.match(/^([- A-Za-zа-яА-ЯёЁ0-9_@]+)$/)) {
      const options = {
        type: 'POST',
        data: { path: '/', name },
      };
      fetch('/resources/api/directory/create', options)
        .then(response => {
          return response.json();
        })
        .then(res => {
          if (res.code !== 'OK') {
            this.setState({ error: res.error });
            return;
          }
          let files = [...this.state.files];
          files.push({
            path: `/${name}`,
            webPath: `/resources/upload/${name}`,
            name,
            extension: '',
            created: new Date(),
            modified: new Date(),
            size: 4096,
            directory: true,
          });
          this.setState({ files, createFolder: false });
        })
        .catch(err => {
          console.log(err.message);
          this.setState({ error: res.error });
        });
    }
  }

  closeModal() {
    this.setState({
      createFolder: false,
      error: null,
    });
  }

  render() {
    let dialog;
    const { createFolder } = this.state;

    if (createFolder) {
      dialog = (
        <Dialog
          title="Введите имя нового каталога"
          close={this.closeModal}
          ok={this.createFolder}
          error={this.state.error}
        />
      );
    } else {
      dialog = null;
    }

    return (
      <div className={styles.Filemanager}>
        <FilemanagerControls
          createFolder={this.createFolderModal}
        />
        <Filelist files={this.state.files} />
        <div className="fm-menu" style={{ display: 'none' }}>CONTEXT MENU</div>
        {dialog}
      </div>
    );
  }
}

export default Filemanager;
