import React from 'react';
import PropTypes from 'prop-types';
import { facingModes } from '../constants/facingModeTypes';

import '../index.css';

const SwitchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="28px"
    height="24px"
    viewBox="0 0 28 24"
    strokeWidth="2"
  >
    <g strokeWidth="2" transform="translate(0, 0)">
      <polygon
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="square"
        strokeMiterlimit="10"
        points="1,22 27,22 27,5 19,5 17,2 11,2 9,5 1,5 "
        strokeLinejoin="miter"
      />
      <circle
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="square"
        strokeMiterlimit="10"
        cx="14"
        cy="13"
        r="5"
        strokeLinejoin="miter"
      />
      <circle
        fill="#fff"
        cx="5"
        cy="9"
        r="1"
        strokeLinejoin="miter"
        strokeLinecap="square"
      />
    </g>
  </svg>
);

const SwitchModeButton = ({ currentFacingMode = '', onSwitch }) => (
  <button
    className="camera-switch-btn"
    onClick={() =>
      onSwitch(
        currentFacingMode === facingModes.ENVIRONMENT
          ? facingModes.USER
          : facingModes.ENVIRONMENT
      )
    }
    type="button"
  >
    <SwitchIcon />
  </button>
);

SwitchModeButton.propTypes = {
  currentFacingMode: PropTypes.string.isRequired,
  onSwitch: PropTypes.func.isRequired,
};

export default SwitchModeButton;
