import React, { Component } from 'react';
import styles from './Filemanager.css';
import {
  dirUrl,
  uploadUrl,
  createUrl,
  copyUrl,
  moveUrl,
  deleteUrl,
  zipUrl,
  contextMenu,
} from './config';
import { sortFiles, clearSelection } from '../../utils/utils';

import Filelist from '../../components/Filelist/Filelist';
import FilemanagerControls from '../../components/FilemanagerControls/FilemanagerControls';
import Dialog from '../../components/UI/Dialog/Dialog';
import ContextMenu from '../../components/UI/ContextMenu/ContextMenu';
import FancyBox from '../../components/Fancybox/Fancybox';
import Message from '../../components/UI/Message/Message';

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
     * @param {boolean} messageShown - show message
     * @param {string} message - message text
     * @param {number} timerId - timer Id to close message after timer interval
     * @param {number} timerInterval - message text
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
      opened: '',
      from: [],
      messageShown: false,
      message: '',
      timerId: null,
      timerInterval: 5000,
    };
    // methods
    this.fetchData = this.fetchData.bind(this);
    this.doubleClickHandler = this.doubleClickHandler.bind(this);
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
    this.zipFiles = this.zipFiles.bind(this);
    this.showMessage = this.showMessage.bind(this);
    this.closeMessage = this.closeMessage.bind(this);
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
    let sendData = [];
    const keys = Object.keys(data);
    keys.forEach(key => {
      sendData.push(`${key}=${data[key]}`);
    });

    const options = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      body: encodeURI(sendData.join('&')),
    };

    fetch(url, options)
      .then(response => {
        return response.json();
      })
      .then(json => {
        if (typeof callback === 'function') {
          callback(json);
          return;
        }
        this.showMessage(JSON.stringify(json));
      })
      .catch(err => {
        const message = err.comment ? err.comment : err.message;
        this.showMessage(message);
        console.log(err);
      });
  }

  /**
 * double click on file/folder handler.
 * @param {Event} event - event object
 * @param {object} file - file object.
 */
  doubleClickHandler(event, file) {
    // clear selection after mousedoen event
    clearSelection();
    // if clicked on folder
    if (file.directory === true) {
      this.changeDir(file.path);
      return;
    }
    const opened = file.webPath;
    this.setState({ openFancy: true, opened });
  }

  /**
 * change current folder
 * @param {string} path - relative path to folder
 */
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

    this.setState({ path, selected: [] }, this.fetchData(
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
    menu.open.clicked = (event) => this.openFile(event, file);
    if (file.directory === true) {
      menu.archive.disabled = false;
      menu.archive.clicked = (event) => this.zipFiles(event, file);
      menu.copyUrl.disabled = true;
      menu.copyUrl.clicked = () => {};
      menu.save.disabled = true;
      menu.save.clicked = () => {};
      menu.delete.disabled = false;
      menu.delete.clicked = (event) => this.delete(event, file);
    }
    if (file.directory === false) {
      menu.archive.disabled = false;
      menu.archive.clicked = (event) => this.zipFiles(event, file);
      menu.copyUrl.disabled = false;
      menu.copyUrl.clicked = (event) => this.copyUrl(event, file);
      menu.copy.disabled = false;
      menu.copy.clicked = (event) => this.copyFiles(event, file);
      menu.paste.disabled = true;
      menu.paste.clicked = () => {};
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

  /**
   * select file or folder.
   * @param {Event} event - event object
   * @param {object} file - file object.
   */
  selectItem(event, file) {
    const ctrl = event.ctrlKey;
    const files = [...this.state.files];
    const index = files.findIndex(el => el === file);
    let selected = [...this.state.selected];

    if (ctrl || (event.type !== 'contextmenu' && selected.length > 0)) {
      const arrIndex = selected.indexOf(index);
      if (arrIndex !== -1 && event.type !== 'contextmenu') selected.splice(arrIndex, 1);
      else selected.push(index);
    }

    if (!ctrl) {
      if (selected[0] === index && event.type !== 'contextmenu') selected = [];
      else selected = [index];
    }

    this.setState({ selected });
  }

  /**
   * open file/folder, if file - open file in new tab, if folder - change current folder
   * @param {Event} event - event object
   * @param {object} file - file object.
   */
  openFile(event, file) {
    if (file.directory !== true) {
      const path = window.location.protocol + '//' + document.location.host + file.webPath;
      window.open(path, '_blank');
      return;
    }
    this.changeDir(file.path);
  }

  // copy files
  copyFiles(event, file) {
    const selected = [...this.state.selected].map(item => this.state.files[item]);
    // const message = `Файл${selected.length > 1 ? 'ы' : ' ' + selected[0].name} успешно скопирован${selected.length > 1 ? 'ы' : ''}`;
    this.setState({
      from: selected,
      selected: [],
    });
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
          copyUrl,
          { to: `${self.state.path}/${item.name}.${item.extension}`, from: item.path },
          () => {},
        );
        files.push(item);
      }
    });
    if (files.length > length) this.setState({ files: sortFiles(files), from: [] });
    else this.setState({ from: [] });
  }

  // upload files on server
  uploadFile(event) {
    const files = event.target.files;
    if (files instanceof FileList) {
      const form = new FormData();
      const dir = files.length > 1 ? 'files[]' : 'file';
      form.append('path', this.state.path);
      [...files].forEach(file => { form.append(dir, file); });
      fetch(uploadUrl, { method: 'POST', body: form })
        .then((response) => { return response.json(); })
        .then(json => {
          if (json.code && json.code === 'OK') {
            this.showMessage('Файлы успешно загружены на сервер');
            return;
          }
          this.showMessage(json);
        })
        .catch(err => {
          const message = err.comment ? err.comment : err.message;
          this.showMessage(message);
          console.log(err);
        });
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

  // archives files
  zipFiles(event, file) {
    const selected = [...this.state.selected];
    const paths = selected.map(el => `path[]=${this.state.files[el].path}`);
    const options = {
      method: 'GET',
    };

    fetch(`${zipUrl}?${encodeURI(paths.join('&'))}`, options)
      .then(response => {
        return response.json();
      })
      .then(json => {
        console.log(json);
      })
      .catch(err => {
        console.log(err);
      });
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
    this.showMessage('Ссылка на файл скопирована');
  }

  // delete file ot folder from server
  delete(event, file) {
    const selected = [...this.state.selected];
    const files = [...this.state.files];
    const self = this;
    selected.forEach(item => {
      const path = files[item];
      self.fetchData(
        deleteUrl,
        { path: path.path },
        () => { this.showMessage('Удаление завершено'); },
      );
      files.splice(item, 1);
    });
    this.setState({ files: sortFiles(files), selected: [] });
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
      this.fetchData(createUrl, data, () => {
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
      });
      return;
    }
    this.showMessage('Не корректное имя каталога');
  }

  // close dialog
  closeModal() {
    this.setState({
      createFolder: false,
      error: null,
    });
  }

  // show message
  showMessage(message) {
    this.setState({ message, messageShown: true });
  }

  // close message
  closeMessage() {
    this.setState({ message: '', messageShown: false });
  }

  render() {
    let dialog = null;
    let context = null;
    let fancyBox = null;
    let message = null;

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
      const fancyFiles = this.state.files.filter(el=>!el.directory).map(file=>file.webPath);
      const selected = fancyFiles.findIndex(el => el === this.state.opened);
      fancyBox = (
        <FancyBox
          files={fancyFiles}
          selected={selected}
          close={()=>this.setState({ openFancy: false })}
        />
      );
    }

    if (this.state.messageShown === true) {
      message = <Message message={this.state.message} close={this.closeMessage}/>;
    }

    return (
      <div className={styles.Filemanager} onClick={this.contextMenuHide} >
        <FilemanagerControls
          createFolder={this.createFolderModal}
          pasteFiles={this.pasteFiles}
          pasteDisable={this.state.from.length === 0}
          upload={this.uploadFile}
          path={this.state.path}
        />
        <Filelist
          files={this.state.files}
          select={this.selectItem}
          selected={this.state.selected}
          context={this.contextMenu}
          fancy={this.doubleClickHandler}
        />
        {context}
        {dialog}
        {fancyBox}
        {message}
      </div>
    );
  }
}

export default Filemanager;
