import 'aframe';
import 'aframe-extras';
import 'aframe-html-shader';
import 'aframe-animation-component';
import 'aframe-look-at-component';

import React from 'react';
import PropTypes from 'prop-types';

import pokeball from './images/pokeball.png';

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
      init() {
        this.el.addEventListener('click', () => {
          this.el.setAttribute('animation', 'property: rotation; duration: 1500; easing: easeInSine; loop: false; to: 0 260 0');
          setTimeout(() => {
            onCatch && onCatch(this.el);
          }, 1500);
        });
      }
    });
  }

  render() {
    return (
      <a-scene>
        <a-assets>
          <img id="pokeball" src={pokeball} alt="" />
        </a-assets>

        <a-sphere hide-on-focus position="0 3 -5" radius="0.6" src="#pokeball" rotation="20 -80 5"></a-sphere>

        <a-camera>
          <a-cursor></a-cursor>
        </a-camera>
      </a-scene>
    );
  }
};

Pokeball.propTypes = {
  onCatch: PropTypes.func
};

export default Pokeball;
