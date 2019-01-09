import React, { Component } from 'react';
import styles from './Filemanager.css';
import { dirUrl, uploadUrl, contextMenu } from './config';
import { sortFiles, clearSelection } from '../../utils/utils';

import Filelist from '../../components/Filelist/Filelist';
import FilemanagerControls from '../../components/FilemanagerControls/FilemanagerControls';
import Dialog from '../../components/UI/Dialog/Dialog';
import ContextMenu from '../../components/UI/ContextMenu/ContextMenu';
import FancyBox from '../../components/Fancybox/Fancybox';

class Filemanager extends Component {
  constructor(props) {
    /**
     * @constructor
     * @param {boolean} loading - fetching state
     * @param {string} error - error message
     * @param {string} path - relate path to files on server
     * @param {Array} files - list of files and folders
     * @param {boolean} createFolder - open dialog for enter new folder name
     * @param {Array} selected - array of indexes of selected files/folders
     * @param {boolean} openContext - open context menu
     * @param {contextMenu} contextMenu - context menu config object
     * @param {Object} contextCoord - coordinates of context menu on screen
     * @param {boolean} openFancy - open fancy slider
     * @param {number} opened - index of current file opend on fancy slider
     * @param {Array} from - array of indexes of copied files/folders
     */
    super(props);
    // state
    this.state = {
      loading: false,
      error: null,
      path: '/',
      files: [],
      createFolder: false,
      selected: [],
      openContext: false,
      contextMenu: contextMenu,
      contextCoord: {},
      openFancy: false,
      opened: -1,
      from: [],
    };
    // methods
    this.fetchData = this.fetchData.bind(this);
    this.dubleClickHandler = this.dubleClickHandler.bind(this);
    this.contextMenu = this.contextMenu.bind(this);
    this.selectItem = this.selectItem.bind(this);
    this.createFolderModal = this.createFolderModal.bind(this);
    this.createFolder = this.createFolder.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.contextMenuHide = this.contextMenuHide.bind(this);
    this.openFile = this.openFile.bind(this);
    this.copyFiles = this.copyFiles.bind(this);
    this.pasteFiles = this.pasteFiles.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.saveFile = this.saveFile.bind(this);
    this.copyUrl = this.copyUrl.bind(this);
    this.delete = this.delete.bind(this);
  }

  componentDidMount() {
    this.fetchData(
      dirUrl,
      { path: this.state.path },
      (json) => this.setState({ files: sortFiles(json.data) }),
    );
  }

  /**
   * fetch POST request from server.
   * @param {string} url - url to fetch
   * @param {object} data - body of request.
   * @param {function} callback - callback after parse request
   */
  fetchData(url, data, callback) {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(data),
    };

    fetch(url, options)
      .then(response => {
        return response.json();
      })
      .then(json => {
        if (typeof callback === 'function') callback(json);
      })
      .catch(err => {
        console.log(err);
      });
  }

  // open fancy box
  dubleClickHandler(event, file) {
    // if clicked on directory
    if (file.directory === true) {
      console.log(file);
      this.changeDir(file.path);
    } else {
      const opened = this.state.files.findIndex(el => file === el);
      this.setState({ openFancy: true, opened });
    }
    clearSelection();
    console.log(file);
  }

  // change directory path
  changeDir(path) {
    const backDir = {
      path: this.state.path,
      name: '...',
      directory: true,
    };
    const callback = (json) => {
      const files = path !== '/' ? [backDir, ...sortFiles(json.data)] : sortFiles(json.data);
      this.setState({ files });
    };

    this.setState({ path }, this.fetchData(
      dirUrl,
      { path },
      callback,
    ));
  }

  /**
   * open context menu.
   * @param {Event} event - onContextMenu event object
   * @param {object} file - file object.
   */
  contextMenu(event, file) {
    event.preventDefault();
    const menu = { ...this.state.contextMenu };
    const index = this.state.files.findIndex(el => el === file);
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
      menu.copy.disabled = false;
      menu.copy.clicked = (event) => this.copyFiles(event, file);
      menu.paste.disabled = true;
      if (this.state.from.length > 0) {
        menu.paste.disabled = false;
        menu.paste.clicked = (event) => this.pasteFiles(event, file);
      }
      menu.save.disabled = false;
      menu.save.clicked = (event) => this.saveFile(event, file);
      menu.delete.disabled = false;
      menu.delete.clicked = (event) => this.delete(event, file);
    }
    const coord = { left: event.pageX, top: event.pageY - 16 };
    this.selectItem(event, file);
    this.setState({ openContext: true, contextCoord: coord, contextMenu: menu });
  }

  // hide context menu
  contextMenuHide() {
    this.setState({ openContext: false });
  }

  // select file or folder
  selectItem(event, item) {
    const ctrl = event.ctrlKey;
    const files = [...this.state.files];
    const index = files.findIndex(el => el === item);
    let selected = [...this.state.selected];

    if (ctrl) {
      const arrIndex = selected.indexOf(index);
      if (arrIndex !== -1) selected.splice(arrIndex, 1);
      else selected.push(index);
    }

    if (!ctrl) {
      if (selected[0] === index) selected = [];
      else selected = [index];
    }

    this.setState({ selected });
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

  // copy files
  copyFiles(event, file) {
    const selected = [...this.state.selected].map(item => this.state.files[item]);
    this.setState({ from: selected, selected: [] });
  }

  // paste files
  pasteFiles(event, file) {
    const copied = [...this.state.from];
    const files = [...this.state.files];
    const length = files.length;
    const self = this;
    copied.forEach(item => {
      let index = files.findIndex(el => el.name === item.name && el.extension === item.extension);
      if (index === -1) {
        self.fetchData(
          '/resources/api/resource/copy',
          { to: self.state.path, from: item.path },
        );
        files.push(item);
      }
    });
    if (files.length > length) this.setState({ files, from: [] });
    else this.setState({ from: [] });
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
      const data = { path: '/', name };
      const options = {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(data),
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
    let fancyBox = null;

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

    if (this.state.openFancy === true) {
      fancyBox = (
        <FancyBox
          files={this.state.files.filter(el=>!el.directory).map(file=>file.webPath)}
          selected={this.state.opened}
          close={()=>this.setState({ openFancy: false })}
        />
      );
    }

    return (
      <div className={styles.Filemanager} onClick={this.contextMenuHide} >
        <FilemanagerControls
          createFolder={this.createFolderModal}
          upload={this.uploadFile}
          path={this.state.path}
        />
        <Filelist
          files={this.state.files}
          select={this.selectItem}
          selected={this.state.selected}
          context={this.contextMenu}
          fancy={this.dubleClickHandler}
        />
        {context}
        {dialog}
        {fancyBox}
      </div>
    );
  }
}

export default Filemanager;
