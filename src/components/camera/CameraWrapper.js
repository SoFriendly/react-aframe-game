import React from 'react';

const wrapperStyle = {
  position: 'relative',
};

const CameraWrapper = ({ className, children }) => (
  <div style={wrapperStyle} className={className}>{children}</div>
);

export default CameraWrapper;
