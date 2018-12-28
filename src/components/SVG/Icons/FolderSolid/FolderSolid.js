import React from 'react';

const FolderSolid = ({ color, width, height }) => (
  <svg
    aria-hidden="true"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    color={color || 'rgba(67, 67, 72,1)'}
    width={width || '100%'}
    height={height || '100%'}
  >
    <path fill="currentColor" d="M464 128H272l-64-64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V176c0-26.51-21.49-48-48-48z" />
  </svg>
);

export default FolderSolid;
