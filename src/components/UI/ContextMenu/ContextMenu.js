import React from 'react';
import styles from './ContextMenu.css';

import ContextMenuItem from './ContextMenuItem/ContextMenuItem';

const ContextMenu = ({ menuList, coord = {} })=> {
  let keys = menuList && typeof menuList === 'object' ? Object.keys(menuList) : [];
  let list = [];

  list = keys.map(item => (
    <ContextMenuItem
      key={item}
      text={menuList[item].text}
      disabled={menuList[item].disabled}
      clicked={menuList[item].clicked}
    />
  ));

  return (
    <ul className={styles.ContextMenu} style={{ top: `${coord.top || 0}px`, left: `${coord.left || 0}px` }}>
      {list}
    </ul>
  );
};

export default ContextMenu;
