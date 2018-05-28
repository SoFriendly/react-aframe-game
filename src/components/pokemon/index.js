import 'aframe';
import 'aframe-extras';
import 'aframe-html-shader';
import 'aframe-animation-component';
import 'aframe-look-at-component';

import React from 'react';
import PropTypes from 'prop-types';

import battle from './audio/pokemon-battle.mp3';

import charizard from './images/charizard.png';
import lightning from './images/lightning.jpg';
import pika from './images/pika.png';
import penhuo from './images/penhuo.png';
import icon from './images/icon.png';

import stadium from './models/stadium.ply';
import seating from './models/seating.ply';
import pikachu from './models/pikachu.ply';

import './index.css';

class Pokemon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hpLeft: 100,
      hpRight: 100,
      energy: 0,
      showResult: 0
    };

    this.timer = null;
  }

  componentDidMount() {
    this.refs.battle.volume = 0.6;
  }

  energyBarEnd() {
    clearInterval(this.timer);
    this.timer = null;
  }

  energyBarBegin() {
    var trun = false; 

    this.timer = setInterval(() => {
      let { energy } = this.state;

      if (energy === 100) {
        trun = true;
      }
      if (energy === 0) {
        trun = false;
      }

      if (trun) {
        energy -= 10;
        this.setState({
          energy
        });
      } else {
        energy += 10;
        this.setState({
          energy
        });
      }
    }, 100);
  }

  onPressStart = () => {
    this.energyBarBegin();
  }

  onPressEnd = () => {
    let { energy, hpLeft, hpRight } = this.state;
    this.energyBarEnd();

    const battle = Math.floor((1 - Math.abs(energy - 50) / 100) * 30);

    hpLeft = Math.max(hpLeft - battle, 0);
    hpRight = Math.max(hpRight - 20, 0);

    if (hpLeft >= 0 && hpRight >= 0) {
      this.setState({
        hpLeft,
        hpRight,
        showResult: hpRight === 0 ? 2 : (hpLeft === 0 ? 1 : 0)
      });
    }
  }

  render () {
    const { hpLeft, hpRight, energy, showResult } = this.state;
    const { onConfirm } = this.props;

    return (
      <div className="pokemon-wrapper">
        <a-scene>
          <a-assets>
            <a-asset-item id="stadium-ply" src={stadium}></a-asset-item>
            <a-asset-item id="seating-ply" src={seating}></a-asset-item>
            <a-asset-item id="pikachu-ply" src={pikachu}></a-asset-item>
            <img id="charizard" src={charizard} alt="" />
            <img id="lightning" src={lightning} alt="" />
            <audio ref="battle" autoPlay loop src={battle}></audio>
          </a-assets>

          {/* <a-sky color="#111"></a-sky> */}

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

          <a-entity position="0 7 -40">
            <a-image src="#charizard" transparent="true" shader="standard"
                     scale="20 20 1" look-at="[camera]"></a-image>
            <a-text position="0 11 0" value="Attack: 20" width="40" color="#FFF"></a-text>
          </a-entity>

          <a-light type="ambient" color="#777"></a-light>
          <a-entity animation="property: rotation; to: 0 360 0; easing: linear; loop: true; dur: 2000">
            <a-light type="point" color="#FFF" position="-10 10 -15" intensity="0.3"></a-light>
            <a-light type="point" color="#FFF" position="10 10 -15" intensity="0.3"></a-light>
          </a-entity>

        </a-scene>

        <div className="battle-wrapper">
          <div className="battle-info">
            <div className="battle-item">
              <img src={penhuo} alt="" />
              <div className="battle-hp-wrapper">
                <div className="battle-hp-bar battle-hp-l" style={{ width: hpLeft + '%' }}></div>
                <div className="battle-hp-text">{hpLeft}/100</div>
              </div>
            </div>
            <div className="battle-item">
              <div className="battle-hp-wrapper">
                <div className="battle-hp-bar battle-hp-r" style={{ width: hpRight + '%' }}></div>
                <div className="battle-hp-text">{hpRight}/100</div>
              </div>
              <img src={pika} alt="" />
            </div>
          </div>
        </div>

        <div className="operation-wrapper">
          <img className="energy-icon" src={icon} alt="" />
          <div className="energy-bar">
            <div className="energy-inner-bar" style={{ left: energy + '%' }}></div>
          </div>
          <button className="energy-btn" onTouchStart={this.onPressStart} onTouchEnd={this.onPressEnd}>按下蓄力</button>
        </div>

        <div className={showResult ? 'result-wrapper show' : 'result-wrapper'}>
          {showResult === 1 &&
            <div className="result-inner">
              <div className="result-title">You Win!</div>
              <img className="result-logo" src={penhuo} alt="" />
              <button className="result-btn" onClick={onConfirm}>收入囊中</button>
            </div>
          }
          {showResult === 2 &&
            <div className="result-inner">
              <div className="result-title">You Lose!</div>
              <button className="result-btn" onClick={onConfirm}>返回</button>
            </div>
          }
        </div>
      </div>
    );
  }
};

Pokemon.propTypes = {
  onConfirm: PropTypes.func
};

export default Pokemon;
