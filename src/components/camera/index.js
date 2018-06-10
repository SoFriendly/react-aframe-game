import './libs/polyfill';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import debounce from 'throttle-debounce/debounce';

import CameraError from './components/CameraError';
import ExploreButton from './components/ExploreButton';
import CameraWrapper from './components/CameraWrapper';
import CameraControl from './components/CameraControl';
import SwitchModeButton from './components/SwitchModeButton';

import { errorTypes } from './constants/errorTypes';
import { facingModes } from './constants/facingModeTypes';

import { buildConstraints, getAvailableDevices } from './libs/utils';

class Camera extends PureComponent {
  constructor(props) {
    super(props);
    const {
      facingMode
    } = this.props;
    const constraints = buildConstraints(facingMode);
    const supportsIntersectionObserver = window.IntersectionObserver;

    this.state = {
      constraints,
      devices: null,
      error: false,
      isIntersecting: false,
      mediaStream: null,
    };
    this.changeFacingMode = this.changeFacingMode.bind(this);

    if (supportsIntersectionObserver) {
      this.io = new IntersectionObserver(this.handleIntersectionObserver);
    }
  }

  async componentWillMount() {
    const devices = await getAvailableDevices('video');
    if (devices) {
      this.setState({
        devices
      });
    }
  }

  async componentDidMount() {
    const supportsIntersectionObserver = window.IntersectionObserver;
    await this.getMediaStream(this.state.constraints);
    if (!supportsIntersectionObserver) {
      this.setVideoStream();
    }

    window.addEventListener('resize', this.handleResize);

    if (supportsIntersectionObserver && this.video) {
      this.io.observe(this.video);
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    const { isIntersecting } = this.state;
    if (isIntersecting !== prevState.isIntersecting) {
      if (isIntersecting) {
        const {
          facingMode
        } = this.state.constraints.video;
        const constraints = buildConstraints(facingMode);
        await this.getMediaStream(constraints);
        return this.setVideoStream();
      } else {
        return this.stopMediaStream();
      }
    }
  }

  componentWillUnmount() {
    this.stopMediaStream();
    this.io.disconnect();
    window.removeEventListener('resize', this.handleResize);
  }

  async changeFacingMode(facingMode = '') {
    if (!facingModes[facingMode]) {
      return this.setState({ error: errorTypes.INVALID_FACING_MODE.type });
    }
    this.stopMediaStream();
    const constraints = buildConstraints(facingMode);
    await this.getMediaStream(constraints);
    this.setVideoStream();
  }

  async getMediaStream(constraints = {}) {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      this.setState({ mediaStream });
    } catch (error) {
      console.log(error);
      this.setState({ error: errorTypes.UNSUPPORTED.type });
    }
  }

  handleIntersectionObserver = ([entry]) => {
    if (entry) {
      return this.setState({ isIntersecting: entry.isIntersecting });
    }
  };

  handleResize = debounce(150, async () => {
    const { facingMode } = this.state.constraints.video;
    await this.getMediaStream(buildConstraints(facingMode));
    this.setVideoStream();
  });

  setVideoStream() {
    const { mediaStream } = this.state;
    const { onSuccess } = this.props;
    if (this.video) {
      this.video.src = mediaStream;
      this.video.srcObject = mediaStream;
      this.video.onloadedmetadata = () => this.video.play();
      onSuccess && onSuccess(this.video);
    }
  }

  stopMediaStream() {
    if (this.video && this.video.srcObject) {
      const { onStopMediaStream } = this.props;
      this.video.srcObject.getTracks().forEach(t => t.stop());
      if (onStopMediaStream) {
        onStopMediaStream();
      }
    }
  }

  render() {
    const { hasHomeRender, onControl, onHelp } = this.props;
    const { constraints = {}, devices, error } = this.state;
    const multipleDevices = devices && devices.length > 1;
    const { video: { facingMode } } = constraints;

    if (error) {
      return <CameraError errorType={error} />
    } else {
      return (
        <CameraWrapper>
          <video
            autoPlay
            playsInline
            ref={video => (this.video = video)}
          />
          <CameraControl>
            {!hasHomeRender ? null: (
              <ExploreButton onControl={onControl} onHelp={onHelp} />
            )}
          </CameraControl>
          {multipleDevices && (
            <SwitchModeButton
              currentFacingMode={facingMode}
              onSwitch={this.changeFacingMode}
            />
          )}
        </CameraWrapper>
      );
    }
  }
};

Camera.defaultProps = {
  facingMode: facingModes.ENVIRONMENT
};

Camera.propTypes = {
  hasHomeRender: PropTypes.bool,
  facingMode: PropTypes.string,
  onStopMediaStream: PropTypes.func,
  onControl: PropTypes.func,
  onHelp: PropTypes.func,
  onSuccess: PropTypes.func
};

export default Camera;
