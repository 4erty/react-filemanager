import React, { Component } from 'react';
import styles from './Fancybox.css';

import FancyPopup from './FancyPopup/FancyPopup';
import Close from './SVG/Icons/Close';
import ChevronLeft from './SVG/Icons/ChevronLeft';
import ChevronRight from './SVG/Icons/ChevronRight';

export default class Fancybox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      files: props.files,
      selected: props.selected || 0,
    };

    this.nextFile = this.nextFile.bind(this);
    this.previousFile = this.previousFile.bind(this);
    this.closeHandler = this.closeHandler.bind(this);
  }

  previousFile() {
    const len = this.state.files.length;
    let current = this.state.selected;
    if (current - 1 < 0) current = len;
    current--;
    this.setState({ selected: current });
  }

  nextFile() {
    const len = this.state.files.length;
    let current = this.state.selected;
    if (current + 1 >= len) current = -1;
    current++;
    this.setState({ selected: current });
  }

  closeHandler() {
    this.props.close();
  }

  render() {
    return (
      <div className={styles.Fancybox}>
        <div className={styles.FancyboxPopup}>
          <div className={styles.FancyboxClose} onClick={this.closeHandler}>
            <Close color={'rgba(204, 204, 204, 0.54)'}/>
          </div>
          <div className={styles.FancyboxLeftArrow} onClick={this.previousFile}>
            <ChevronLeft color={'rgba(204, 204, 204, 0.87)'} />
          </div>
          <div className={styles.FancyboxContent}>
            <FancyPopup path={this.state.files[this.state.selected]}/>
          </div>
          <div className={styles.FancyboxRightArrow} onClick={this.nextFile}>
            <ChevronRight color={'rgba(204, 204, 204, 0.87)'} />
          </div>
        </div>
      </div>
    );
  }
}
