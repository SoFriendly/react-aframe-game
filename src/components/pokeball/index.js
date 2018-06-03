import 'aframe';
import 'aframe-extras';
import 'aframe-html-shader';
import 'aframe-animation-component';
import 'aframe-look-at-component';
import 'aframe-physics-system';
import registerClickDrag from 'aframe-click-drag-component';

import React from 'react';
import PropTypes from 'prop-types';

import pokeball from './images/pokeball.png';
import pikachu from '../pokemon/models/pikachu.ply';

registerClickDrag(window.AFRAME);

class Pokeball extends React.Component {
  componentDidMount() {
    this.registerEvents();
  }

  registerEvents = () => {
    const { onCatch } = this.props;

    const draggable = document.querySelector('[click-drag]');
    const pikachu = document.querySelector('#pikachu');

    pikachu.addEventListener('collide', e => {
      const velocity = e.detail.body.velocity;
      if (velocity.x !== 0 || velocity.y !== 0 || velocity.z !==0) {
        setTimeout(() => {
          onCatch && onCatch();
        }, 2000);
      }
    });
    
    draggable.addEventListener('dragstart', dragInfo => {
      draggable.components['dynamic-body'].pause();
    });

    draggable.addEventListener('dragend', dragInfo => {

      const camera = draggable.sceneEl.camera;

      const rotation = camera.up.clone();

      rotation.cross(camera.getWorldDirection());

      const rotatedVelocity = new window.AFRAME.THREE.Vector3(
        dragInfo.detail.velocity.x * 0.5,
        dragInfo.detail.velocity.y * 0.5,
        dragInfo.detail.velocity.z * 0.5
      );

      rotatedVelocity.applyAxisAngle(rotation, Math.PI / 8);
      draggable.components['dynamic-body'].play();
      draggable.body.velocity.set(rotatedVelocity.x, rotatedVelocity.y, rotatedVelocity.z);
    });
  }

  render() {
    return (
      <a-scene>
        <a-assets>
          <a-asset-item id="pikachu-ply" src={pikachu}></a-asset-item>
          <img id="pokeball" src={pokeball} alt="" />
        </a-assets>

        <a-entity id="pikachu" dynamic-body="mass: 10" position="0 0.6 -8">
          <a-entity ply-model="src: #pikachu-ply" scale=".2 .2 .2" rotation="-90 70 0"></a-entity>
        </a-entity>

        <a-sphere click-drag dynamic-body="mass: 10" position="0 3 -4" radius="0.3" src="#pokeball" rotation="20 -80 5"></a-sphere>

        <a-plane material="transparent:true; opacity: 0;" static-body rotation="-90 0 0" width="200" height="200" color="#fff"></a-plane>

        <a-camera look-controls-enabled="false"></a-camera>
      </a-scene>
    );
  }
};

Pokeball.propTypes = {
  onCatch: PropTypes.func
};

export default Pokeball;
