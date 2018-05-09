import React from 'react';

const wrapperStyle = {
  position: 'relative',
  width: '100%',
  height: '100%'
};

const CameraWrapper = ({ children }) => (
  <div style={wrapperStyle}>{children}</div>
);

export default CameraWrapper;
