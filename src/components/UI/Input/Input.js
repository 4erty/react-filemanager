import React, { Component } from 'react';
import styles from './Input.css';

class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || '',
    };

    this.valueChangeHandler = this.valueChangeHandler.bind(this);
  }

  valueChangeHandler(event) {
    const value = event.target.value;
    const callback = typeof this.props.callback === 'function' ? () => this.props.callback(this.state.value) : undefined;
    this.setState(()=>{
      return {
        value,
      };
    }, callback);
  }

  render() {
    let label = this.props.label ? <label>{this.props.label}</label> : null;
    let input = null;

    switch (this.props.type) {
      case 'textarea':
        input = <textarea>{this.state.value}</textarea>;
        break;
      default:
        input = (
          <input
            className={styles.Input}
            value={this.state.value}
            onChange={this.valueChangeHandler}
          />
        );
    }
    return (
      <div className={styles.InputContainer}>
        {label}
        {input}
        <span className={styles.error}>{this.props.error}</span>
      </div>
    );
  }
}

export default Input;
