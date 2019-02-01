import React from 'react';
import classes from './ProgressBar.css';

const ProgressBar = ({ width }) => {
  return (
    <React.Fragment>
      <div className={classes.Backdrop}/>
      <div className={classes.ProgressBar}>
        <span className={classes.Progress} style={{ width: `${width}%` }}/>
      </div>
    </React.Fragment>
  );
};

export default ProgressBar;
