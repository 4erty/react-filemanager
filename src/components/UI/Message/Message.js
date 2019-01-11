import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Message.css';

class Message extends Component {
  constructor(props) {
    super(props);
    this.timerId = null;
    this.timerInterval = 3000;
  }

  componentDidMount() {
    this.timerId = setTimeout(this.props.close, this.timerInterval);
  }

  componentWillUnmount() {
    clearTimeout(this.timerId);
  }

  render() {
    console.log(this.props.message);
    const message = typeof this.props.message === 'string' ? this.props.message : this.props.message.toString();
    return (
      <div className={styles.Message}>
        <p className={styles.MessageText}>{this.props.message}</p>
        <button className={styles.MessageClose} onClick={this.props.close}>Закрыть</button>
      </div>
    );
  }
}

Message.propTypes = {
  message: PropTypes.string,
  close: PropTypes.func,
};

export default Message;
