import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import FullWrapper from './widgets/full-wrapper';

import ARMarker from './components/ar-marker';
import Preload from './components/preload';
import Pokeball from './components/pokeball';
import Pokemon from './components/pokemon';
import Camera from './components/camera';
import Detector from './components/detector';
import Help from './components/help';

import resources from './common/resources';
import { parse } from './common/query';

import './index.css';

const params = parse(window.location.search);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'preload', // ['preload', camera', 'help', 'detect', 'catch', 'battle']
      camera: null,
      hasHomeRender: true
    };
  }

  onComplete = () => {
    this.setState({
      status: 'camera'
    });
  }

  onCameraSuccess = (camera) => {
    this.setState({
      camera
    });
  }

  onCameraHelp = () => {
    this.setState({
      status: 'help'
    });
  }

  onHelpClose = () => {
    this.setState({
      status: 'camera'
    });
  }

  onCameraControl = () => {
    this.setState({
      status: 'detect',
      hasHomeRender: false
    });
  }

  onDetect = () => {
    this.setState({
      status: 'catch'
    });
  }

  onDetectBack = () => {
    this.setState({
      status: 'camera',
      hasHomeRender: true
    });
  }

  onBallCatch = () => {
    this.setState({
      status: 'battle'
    });
  }

  onConfirm = () => {
    this.setState({
      status: 'camera',
      hasHomeRender: true
    });
  }

  render () {
    const { status, camera, hasHomeRender } = this.state;
    
    if (params.marker === 'true') {
      return <ARMarker />
    } else {
      return (
        <FullWrapper>
          { status === 'help' &&
            <Help onClose={this.onHelpClose} />
          }
          { status === 'preload' &&
            <Preload resources={resources} onComplete={this.onComplete} />
          }
          { status !== 'preload' &&
            <Camera hasHomeRender={hasHomeRender} onSuccess={this.onCameraSuccess} onHelp={this.onCameraHelp} onControl={this.onCameraControl} />
          }
          { status === 'detect' &&
            <Detector camera={camera} onDetect={this.onDetect} onBack={this.onDetectBack} />
          }
          { status === 'catch' &&
            <Pokeball onCatch={this.onBallCatch} />
          }
          { status === 'battle' &&
            <Pokemon onConfirm={this.onConfirm} />
          }
        </FullWrapper>
      );
    }
  }
}

ReactDOM.render(<App/>, document.querySelector('#app'));
