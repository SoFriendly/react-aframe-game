import React from 'react';

import '../index.css';

const style = {
  width: window.innerWidth,
  height: window.innerHeight
}

const CameraWrapper = ({ children }) => (
  <div className="camera-wrapper" style={style}>{children}</div>
);

export default CameraWrapper;
