import React, { Component } from 'react';
import styles from './Filemanager.css';
import { dirUrl, uploadUrl, contextMenu } from './config';
import { sortFiles } from '../../utils/utils';

import Filelist from '../../components/Filelist/Filelist';
import FilemanagerControls from '../../components/FilemanagerControls/FilemanagerControls';
import Dialog from '../../components/UI/Dialog/Dialog';
import ContextMenu from '../../components/UI/ContextMenu/ContextMenu';

class Filemanager extends Component {
  constructor(props) {
    super(props);
    // state
    this.state = {
      loading: false,                     // state for await response from server
      error: null,                        // error message
      path: '/',
      files: [],                          // list of files and folders
      createFolder: false,                // open dialog for enter new folder name
      selected: -1,                       // current item selected
      openContext: false,
      contextMenu: contextMenu,
      contextCoord: {},
    };
    // methods
    this.contextMenu = this.contextMenu.bind(this);
    this.selectItem = this.selectItem.bind(this);
    this.createFolderModal = this.createFolderModal.bind(this);
    this.createFolder = this.createFolder.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.contextMenuHide = this.contextMenuHide.bind(this);
    this.openFile = this.openFile.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.saveFile = this.saveFile.bind(this);
    this.copyUrl = this.copyUrl.bind(this);
    this.delete = this.delete.bind(this);
  }

  componentDidMount() {
    const options = {
      type: 'POST',
      data: { path: this.state.path },
    };
    fetch(dirUrl, options)
      .then(response => {
        return response.json();
      })
      .then(json => {
        this.setState(() => {
          return {
            files: sortFiles(json.data),
          };
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  // fetch metadata from server
  fetchMetadata(path) {
    const options = {
      type: 'POST',
      data: { path },
    };
    fetch(dirUrl, options)
      .then(response => {
        return response.json();
      })
      .then(json => {
        this.setState(() => {
          return {
            files: sortFiles(json.data),
          };
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  // open context menu
  contextMenu(event, file) {
    event.preventDefault();
    const menu = { ...this.state.contextMenu };
    menu.open.clicked = (event) => this.openFile(event, file);
    if (file.directory === true) {
      menu.copyUrl.disabled = true;
      menu.copyUrl.clicked = (event) => this.copyUrl(event, file);
      menu.save.disabled = true;
      menu.save.clicked = (event) => this.saveFile(event, file);
      menu.delete.disabled = false;
      menu.delete.clicked = (event) => this.delete(event, file);
    }
    if (file.directory === false) {
      menu.copyUrl.disabled = false;
      menu.copyUrl.clicked = (event) => this.copyUrl(event, file);
      menu.save.disabled = false;
      menu.save.clicked = (event) => this.saveFile(event, file);
      menu.delete.disabled = false;
      menu.delete.clicked = (event) => this.delete(event, file);
    }
    const coord = { left: event.pageX, top: event.pageY - 16 };
    this.setState({ openContext: true, contextCoord: coord, contextMenu: menu });
  }

  // hide context menu
  contextMenuHide() {
    this.setState({ openContext: false });
  }

  // select file or folder
  selectItem(item) {
    const files = [...this.state.files];
    let index = files.findIndex(el => el === item);
    if (this.state.selected === index) index = -1;
    this.setState({ selected: index });
  }

  // open file or folder
  openFile(event, file) {
    if (file.directory !== true) {
      const path = window.location.protocol + '//' + document.location.host + file.webPath;
      window.open(path, '_blank');
      return;
    }
    console.log(event, file);
  }

  // upload files on server
  uploadFile(event) {
    const files = event.target.files;
    if (files instanceof FileList) {
      const form = new FormData();
      const dir = files.length > 1 ? 'files[]' : 'file';
      [...files].forEach(file => { form.append(dir, file); });
      fetch(uploadUrl, { method: 'POST', body: form })
        .then((response) => { return response.json(); })
        .then(json => { console.log(json); })
        .catch(err => { console.log(err); });
    }
  }

  // save file
  saveFile(event, file) {
    const element = document.createElement('a');
    const path = window.location.protocol + '//' + document.location.host + file.webPath;

    element.setAttribute('href', path);
    if (typeof element.download !== 'undefined') element.setAttribute('download', '');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  // copy file url
  copyUrl(event, file) {
    const tempInput = document.createElement('input');
    const temp = window.location.protocol + '//' + document.location.host + file.webPath;
    tempInput.setAttribute('value', encodeURI(temp));
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
  }

  // delete file ot folder from server
  delete(event, file) {
    console.log(event, file);
  }

  // open Dialog for enter folder name
  createFolderModal() {
    this.setState({ createFolder: true });
  }

  // run create folder, afeter clieck ok in Dialog
  createFolder(name) {
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

  // close dialog
  closeModal() {
    this.setState({
      createFolder: false,
      error: null,
    });
  }

  render() {
    let dialog = null;
    let context = null;

    const { createFolder, openContext } = this.state;

    if (createFolder === true) {
      dialog = (
        <Dialog
          title="Введите имя нового каталога"
          close={this.closeModal}
          ok={this.createFolder}
          error={this.state.error}
        />
      );
    }

    if (openContext === true) {
      context = <ContextMenu menuList={this.state.contextMenu} coord={this.state.contextCoord}/>;
    }

    return (
      <div className={styles.Filemanager} onClick={this.contextMenuHide} >
        <FilemanagerControls
          createFolder={this.createFolderModal}
          upload={this.uploadFile}
        />
        <Filelist
          files={this.state.files}
          select={this.selectItem}
          selected={this.state.selected}
          context={this.contextMenu}
        />
        {context}
        {dialog}
      </div>
    );
  }
}

export default Filemanager;
