import React from 'react';
import PropTypes from 'prop-types';

import '../index.css';

const ExploreButton = ({ onControl, onHelp }) => (
  <div className="camera-explore-wrapper">
    <button className="camera-main-btn" onClick={onControl} />
    <button className="camera-help-btn" onClick={onHelp} />
  </div>
);

ExploreButton.propTypes = {
  onControl: PropTypes.func,
  onHelp: PropTypes.func
};

export default ExploreButton;
