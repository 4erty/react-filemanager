import React from 'react';
import styles from './Button.css';

const Button = ({ children, clicked, disabled })=>{
  const text = typeof children === 'string' ? children : '';
  return (
    <div className={styles.ButtonWrapper}>
      <button
        className={styles.Button}
        onClick={clicked}
        disabled={disabled || false}
      >{text}</button>
    </div>
  );
};

export default Button;
