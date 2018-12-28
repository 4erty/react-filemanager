import React from 'react';
import styles from './ContextMenuItem.css';

const ContextMenuItem = ({ text, clicked, disabled }) => {
  const linkClass = disabled
    ? [styles.ContextMenuLink, styles.ContextMenuLink_disabled].join(' ')
    : styles.ContextMenuLink;
  return (
    <li className={styles.ContextMenuItem}>
      <a className={linkClass} onClick={clicked}>{text}</a>
    </li>
  );
};

export default ContextMenuItem;
