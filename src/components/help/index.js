import React from 'react';
import PropTypes from 'prop-types';

import Swipe from 'react-swipe';

import close from './images/close.png';
import cocacola from './images/cocacola.jpg';
import cap from './images/cap.jpg';
import marker from './images/marker.png';

import './index.css';

class Help extends React.Component {
  constructor(props) {
    super(props);

    this.swipe = null;
  }

  nextStep = () => {
    this.swipe.next();
  }

  render() {
    const { onClose } = this.props;

    return (
      <div className="help-wrapper">
        <div className="help-main">
          <img className="help-close" src={close} onClick={onClose} alt="" />
          <Swipe
            className="carousel"
            ref={swipe => this.swipe = swipe}
            swipeOptions={{ continuous: false }}
          >
            <div className="help-step">
              <img className="help-image" src={cocacola} alt="" />
              <p className="help-text">购买可口可乐乐享装任意一瓶</p>
              <button className="help-btn" onClick={this.nextStep}>下一步</button>
            </div>
            <div className="help-step">
              <img className="help-image" src={cap} alt="" />
              <p className="help-text">打开瓶盖，寻找瓶盖上的专属码</p>
              <button className="help-btn" onClick={this.nextStep}>下一步</button>
            </div>
            <div className="help-step">
              <img className="help-image" src={marker} alt="" />
              <p className="help-text">扫描专属码，发现惊喜，更有机会赢得千万豪礼</p>
              <button className="help-btn" onClick={onClose}>我知道了</button>
            </div>
          </Swipe>
        </div>
      </div>
    );
  }
};

Help.propTypes = {
  onClose: PropTypes.func
}

export default Help;
