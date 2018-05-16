import 'aframe';
import 'aframe-extras';
import 'aframe-html-shader';
import 'aframe-animation-component';
import 'aframe-look-at-component';

import React from 'react';

import battle from './audio/pokemon-battle.mp3';

import charizard from './images/charizard.png';
import lightning from './images/lightning.jpg';

import stadium from './models/stadium.ply';
import seating from './models/seating.ply';
import pikachu from './models/pikachu.ply';

export default class Pokemon extends React.Component {

  componentDidMount() {
    this.refs.battle.volume = 0.6;
  }

  render () {
    return (
      <a-scene>
        <a-assets>
          <a-asset-item id="stadium-ply" src={stadium}></a-asset-item>
          <a-asset-item id="seating-ply" src={seating}></a-asset-item>
          <a-asset-item id="pikachu-ply" src={pikachu}></a-asset-item>
          <img id="charizard" src={charizard} alt="" />
          <img id="lightning" src={lightning} alt="" />
          <audio ref="battle" autoPlay loop src={battle}></audio>
        </a-assets>

        <a-sky color="#111"></a-sky>

        <a-entity ply-model="src: #stadium-ply"
                  position="0 -11 -27" scale=".8 .8 .8" rotation="-90 0 0"></a-entity>

        <a-entity ply-model="src: #seating-ply"
                  position="0 -8 -110" scale=".8 .8 .8" rotation="-90 90 0"></a-entity>
        <a-entity ply-model="src: #seating-ply"
                  position="-65 -8 -10" scale=".8 .8 .8" rotation="-90 180 0"></a-entity>
        <a-entity ply-model="src: #seating-ply"
                  position="65 -8 -10" scale=".8 .8 .8" rotation="-90 0 0"></a-entity>
        
        <a-entity position="1.4 -0.6 -3">
          <a-entity ply-model="src: #pikachu-ply"
                    scale=".1 .1 .1" rotation="-90 -80 0"></a-entity>
          <a-sphere src="#lightning" position="0 0 -0.5" rotation="-90 0 0"
                    color="#FFF" radius="1.8" opacity="0.3" shader="flat"
                    animation="property: opacity; loop: true; to: 0.4; dur: 1000"></a-sphere>
        </a-entity>

        <a-image src="#charizard" transparent="true" shader="standard" position="0 7 -40"
                scale="20 20 1" look-at="[camera]"></a-image>

        <a-light type="ambient" color="#777"></a-light>
        <a-entity animation="property: rotation; to: 0 360 0; easing: linear; loop: true; dur: 2000">
          <a-light type="point" color="#FFF" position="-10 10 -15" intensity="0.3"></a-light>
          <a-light type="point" color="#FFF" position="10 10 -15" intensity="0.3"></a-light>
        </a-entity>

        <a-camera>
          <a-cursor></a-cursor>
        </a-camera>

      </a-scene>
    );
  }
};
