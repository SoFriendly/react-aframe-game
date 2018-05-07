import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import VRScene from './components/vr-scene';
import Camera from './components/camera';
import Detector from './components/detector';

import './index.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      camera: null
    };
  } 

  onCameraSuccess = (camera) => {
    this.setState({
      camera
    });
  }

  render () {
    const { camera } = this.state;

    return (
      <div>
        <Camera onSuccess={this.onCameraSuccess} />
        <VRScene />
        <Detector camera={camera} />
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.querySelector('#app'));
