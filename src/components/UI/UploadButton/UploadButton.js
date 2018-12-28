import React, { Component } from 'react';
import styles from './UploadButton.css';

class UploadButton extends Component {
  constructor(props) {
    super(props);
    this.inputFile = React.createRef();
    this.showDialog = this.showDialog.bind(this);
  }

  showDialog() {
    this.inputFile.current.click();
  }

  render() {
    const { children, clicked, disabled } = this.props;

    return (
      <div className={styles.ButtonWrapper}>
        <button
          className={styles.Button}
          onClick={this.showDialog}
          disabled={disabled || false}
        >{children}</button>
        <input
          ref={this.inputFile}
          type="file"
          style={{ display: 'none' }}
          onChange={clicked}
          multiple
        />
      </div>
    );
  }
}

export default UploadButton;
