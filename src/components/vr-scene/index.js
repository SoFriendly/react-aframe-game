import 'aframe';
import 'aframe-html-shader';
import 'aframe-animation-component';
import 'aframe-particle-system-component';
import React from 'react';
import { Entity, Scene } from 'aframe-react';

export default class VRScene extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: 'red'
    };
  }

  changeColor = () => {
    const colors = ['red', 'orange', 'yellow', 'green', 'blue'];
    this.setState({
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }

  render () {
    const { color } = this.state;

    return (
      <Scene>
        <a-assets>

        </a-assets>

        <Entity particle-system={{preset: 'snow', particleCount: 2000}}/>

        <Entity id="box"
          primitive="a-box"
          material={{color: color, opacity: 0.6}}
          animation__rotate={{property: 'rotation', dur: 2000, loop: true, to: '360 360 360'}}
          animation__scale={{property: 'scale', dir: 'alternate', dur: 100, loop: true, to: '1.1 1.1 1.1'}}
          position={{x: 0, y: 1, z: -3}}
          events={{click: this.changeColor}}
        >
          <Entity
            primitive="a-box"
            material={{color: '#24CAFF'}}
            animation__scale={{property: 'scale', dir: 'alternate', dur: 100, loop: true, to: '2 2 2'}}
            geometry={{primitive: 'box', depth: 0.2, height: 0.2, width: 0.2}}
          />
        </Entity>

        <Entity primitive="a-camera">
          <Entity
            primitive="a-cursor"
            animation__click={{property: 'scale', startEvents: 'click', from: '0.1 0.1 0.1', to: '1 1 1', dur: 150}}
          />
        </Entity>
      </Scene>
    );
  }
}