import 'aframe';
import 'aframe-extras';
import 'aframe-html-shader';
import 'aframe-animation-component';
import 'aframe-look-at-component';

import React from 'react';
import PropTypes from 'prop-types';

import ball from './images/ball.png';

class Pokeball extends React.Component {
  componentDidMount() {
    this.registerComponent();
  }

  registerComponent = () => {
    const { onCatch } = this.props;
    // eslint-disable-next-line
    AFRAME.registerComponent('hide-on-focus', {
      dependencies: ['raycaster'],
      schema: {
        target: { type: 'selector' }
      },
      init: function () {
        this.el.addEventListener('click', function () {
          onCatch && onCatch(this.el);
        });
      }
    });
  }

  render() {
    return (
      <a-scene>
        <a-assets>
          <img id="ball" src={ball} alt="" />
        </a-assets>

        <a-image hide-on-focus src="#ball" transparent="true" shader="standard" position="0 20 -40" scale="20 20 1"></a-image>

        <a-camera>
          <a-cursor></a-cursor>
        </a-camera>
      </a-scene>
    );
  }
}

Pokeball.propTypes = {
  onCatch: PropTypes.func
};

export default Pokeball;
