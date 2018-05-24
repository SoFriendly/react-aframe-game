import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import FullWrapper from './components/full-wrapper';
import Preload from './components/preload';
import Pokeball from './components/pokeball';
import Pokemon from './components/pokemon';
import Camera from './components/camera';
import Detector from './components/detector';

import resources from './common/resources';

import './index.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'preload', // ['preload', camera', 'detect', 'catch', 'battle']
      camera: null
    };
  }

  onCameraSuccess = (camera) => {
    this.setState({
      camera
    });
  }

  onComplete = () => {
    this.setState({
      status: 'camera'
    });
  }

  onCameraControl = () => {
    this.setState({
      status: 'detect'
    });
  }

  onDetect = () => {
    this.setState({
      status: 'catch'
    });
  }

  onBallCatch = () => {
    this.setState({
      status: 'battle'
    });
  }

  onConfirm = () => {
    this.setState({
      status: 'camera'
    });
  }

  render () {
    const { status, camera } = this.state;

    return (
      <FullWrapper>
        { status === 'preload' &&
          <Preload resources={resources} onComplete={this.onComplete} />
        }
        { (status === 'camera' || status === 'detect') &&
          <Camera onSuccess={this.onCameraSuccess} onControl={this.onCameraControl} />
        }
        { status === 'detect' &&
          <Detector camera={camera} onDetect={this.onDetect} />
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

ReactDOM.render(<App/>, document.querySelector('#app'));
