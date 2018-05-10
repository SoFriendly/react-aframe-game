import 'aframe';
import 'aframe-extras';
import 'aframe-html-shader';
import 'aframe-animation-component';
import 'aframe-particle-system-component';
import 'aframe-look-at-component';

import React from 'react';

import ball from './images/ball.png';

export default class Pokeball extends React.Component {
  componentDidMount() {
    // eslint-disable-next-line
    AFRAME.registerComponent('hide-on-click', {
      dependencies: ['raycaster'],
      schema: {
        target: { type: 'selector' }
      },
      init: function () {
        var el = this.el;
        el.addEventListener('click', function () {
          el.setAttribute('visible', false);
          // data.target.setAttribute('visible', true);
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

        <a-image hide-on-click
                 src="#ball" transparent="true" shader="standard" position="0 20 -40" scale="20 20 1"></a-image>

        <a-camera>
          <a-cursor></a-cursor>
        </a-camera>
      </a-scene>
    );
  }
}