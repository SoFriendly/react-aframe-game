import React from 'react';
import PropTypes from 'prop-types';

import './index.css';

class Preload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  componentDidMount() {
    const { resources } = this.props;

    Promise.all(this.promiseResource(resources));
  }

  promiseResource = (resources) => {
    const promises = [];

    resources.forEach(resource => {
      if (resource.type === 'image') {
        promises.push(new Promise((resolve, reject) => {
          const image = new Image();
          image.onload = this.onResourceLoad;
          image.onerror = this.onResourceLoad;
          image.src = resource.src;
        }));
      } else if (resource.type === 'audio') {
        promises.push(new Promise((resolve, reject) => {
          const audio = new Audio();
          audio.onload = this.onResourceLoad;
          audio.onerror = this.onResourceLoad;
          audio.src = resource.src;
        }));
      } else {
        // todo
      }
    });

    return promises;
  }

  onResourceLoad = () => {
    let { count } = this.state;
    const { resources, onComplete } = this.props;

    this.setState({
      count: ++count
    });

    if (count === resources.length) {
      setTimeout(()=> {
        onComplete && onComplete();
      }, 800);
    }
  }

  render() {
    const { count } = this.state;
    const { resources } = this.props;

    const percent = resources.length ? Math.ceil((count / resources.length) * 100) : 0;

    return (
      <div className="preload-wrapper">
        <div className="preload-percent">
          <div className="preload-inner">{percent}%</div>
        </div>
        <div className="preload-activity"></div>
      </div>
    );
  }
};

Preload.defaultProps = {
  resources: []
};

Preload.propTypes = {
  resources: PropTypes.array,
  onComplete: PropTypes.func
};

export default Preload;
