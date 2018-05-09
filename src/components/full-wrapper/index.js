import React from 'react';
import './index.css';

const FullWrapper = ({ children, style }) => (
  <div className="full-wrapper" style={style}>{children}</div>
);

export default FullWrapper;
