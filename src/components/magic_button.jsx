import React from 'react';
import '../compCSS/magic_button.css';

export const MagicButton = ({ text = "See more", onClick, className = '', style = {} }) => {
  return (
    <button className={`uiverse-btn ${className}`.trim()} onClick={onClick} style={style}>
      {text}
    </button>
  );
};

export default MagicButton;