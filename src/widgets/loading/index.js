import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import './index.css';

class Loading extends React.Component {
  render() {
    const { content, visible } = this.props;

    return (
      <div className="loading-wrapper" style={{ display: visible ? 'block' : 'none' }}>
        <div className="loading-main">
          <i className="loading-icon"></i>
          <p className="loading-content">{content}</p>
        </div>
      </div>
    );
  }
};

Loading.defaultProps = {
  content: '',
  visible: false
};

Loading.propTypes = {
  content: PropTypes.string,
  visible: PropTypes.bool
};

Loading.show = (content, duration = 2000, callback) => {
  let div = document.createElement('div');
  document.body.appendChild(div);

  function destroy() {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }
  }

  function render() {
    ReactDOM.render(<Loading content={content} visible={true} />, div);
  }

  render();

  setTimeout(() => {
    destroy();
    callback && callback();
  }, duration);
};

export default Loading;
