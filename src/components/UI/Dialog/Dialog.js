import React, { Component } from 'react';
import styles from './Dialog.css';

import Button from '../Button/Button';
import Input from '../Input/Input';

class Dialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
    };
    this.inputChangeHandler = this.inputChangeHandler.bind(this);
    this.okCliked = this.okCliked.bind(this);
    this.cancelClicked = this.cancelClicked.bind(this);
  }

  inputChangeHandler(value) {
    this.setState({ inputValue: value });
  }

  okCliked() {
    this.props.ok(this.state.inputValue);
  }

  cancelClicked() {
    this.props.close();
  }

  render() {
    return (
      <div className={styles.DialogBackdrop}>
        <div className={styles.Dialog}>
          <h2 className={styles.DilaogTitle}>{this.props.title}</h2>
          <section className={styles.DialogText}>
            <Input callback={this.inputChangeHandler} error={this.props.error}/>
          </section>
          <footer className={styles.DialogActions}>
            <Button clicked={this.cancelClicked}>Отмена</Button>
            <Button clicked={this.okCliked}>OK</Button>
          </footer>
        </div>
      </div>
    );
  }
}

export default Dialog;
