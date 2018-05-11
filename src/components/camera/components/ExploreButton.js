import React from 'react';
import PropTypes from 'prop-types';

import '../index.css';

const ExploreButton = ({ onClick }) => (
  <button className="explore-btn" onClick={onClick} />
);

ExploreButton.propTypes = {
  onClick: PropTypes.func,
};

export default ExploreButton;
