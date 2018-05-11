import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import FullWrapper from './components/full-wrapper';
import Pokeball from './components/pokeball';
// import Pokemon from './components/pokemon';
import Camera from './components/camera';
import Detector from './components/detector';

import { parse } from './common/query';

import './index.css';

const params = parse(window.location.search);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'init',
      camera: null
    };
  }

  onCameraSuccess = (camera) => {
    // this.setState({
    //   camera
    // });
  }

  render () {
    const { camera } = this.state;

    if (params.vr === 'true') {
      return (
        <FullWrapper>
          <Camera />
          <Pokeball />
        </FullWrapper>
      );
    } else {
      return (
        <FullWrapper>
          <Camera onSuccess={this.onCameraSuccess} />
          <Detector camera={camera} />
        </FullWrapper>
      );
    }
  }
}

ReactDOM.render(<App/>, document.querySelector('#app'));
