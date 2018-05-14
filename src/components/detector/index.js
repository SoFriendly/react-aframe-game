import './libs/polyfill';

import React from 'react';
import AR from './libs/aruco';

import './index.css';

export default class Detector extends React.Component {
  constructor(props) {
    super(props);
    this.detector = new AR.Detector();
    this.context = null;
    this.imageData = null;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }

  componentDidMount() {
    this.context = this.canvas.getContext('2d');
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.camera) {
      requestAnimationFrame(() => this.tick());
    }
  }

  tick() {
    requestAnimationFrame(() => this.tick());
    this.snapshot();
    const markers = this.detector.detect(this.imageData);
    if (markers.length > 0) {
      this.validatePosition(markers, () => {
        this.drawCorners(markers);
        this.draw2DImg(markers);
      });
    }
  }
  
  snapshot() {
    const { camera } = this.props;
    this.context.drawImage(camera, 0, 0);
    this.imageData = this.context.getImageData(0, 0, this.width, this.height);
  }

  validatePosition(markers, callback) {
    let { offsetTop, offsetLeft, offsetWidth, offsetHeight } = this.sight;

    offsetLeft = offsetLeft - offsetWidth / 2;
    offsetTop = offsetTop - offsetHeight / 2;

    let offsetRight = offsetLeft + offsetWidth;
    let offsetBottom = offsetTop + offsetHeight;

    let result = false;

    for (let i = 0; i < markers.length; i++) {
      const corners = markers[i].corners;
      let count = 0;

      for (let j = 0; j < corners.length; j++) {
        let corner = corners[j];
        let { x, y } = corner;
        if (x >= offsetLeft && x <= offsetRight && y >= offsetTop && y <= offsetBottom) {
          count++;
        }
      }

      if (count === corners.length) {
        result = true;
      }
    }

    if (result) {
      callback && callback();
    }
  }
  
  drawCorners(markers) {
  
    this.context.lineWidth = 2;
  
    for (let i = 0; i < markers.length; i++) {
      const corners = markers[i].corners;
  
      this.context.strokeStyle = 'red';
      this.context.beginPath();
  
      for (let j = 0; j < corners.length; j++) {
        let corner = corners[j];
        this.context.moveTo(corner.x, corner.y);
        corner = corners[(j + 1) % corners.length];
        this.context.lineTo(corner.x, corner.y);
      }
  
      this.context.stroke();
      this.context.closePath();
  
      this.context.strokeStyle = 'green';
      this.context.strokeRect(corners[0].x - 2, corners[0].y - 2, 4, 4);
    }
  }
  
  draw2DImg(markers) {
    const img = new Image();
    img.src = 'data:image/png;base64,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';

    for (let i = 0; i < markers.length; i++) {
      const marker = markers[i];
  
      const start = marker.corners[0];
  
      this.context.save();
      this.context.drawImage(img, start.x, start.y);
      this.context.restore();
    }
  }

  render() {
    return (
      <div className="detector-wrapper">
        <canvas
          width={this.width}
          height={this.height}
          ref={canvas => (this.canvas = canvas)}
        ></canvas>
        <div className="detector-sight">
          <div className="detector-sight-notice">请对准目标扫描3秒</div>
          <div className="detector-sight-body" ref={sight => (this.sight = sight)}>
            <div className="detector-sight-item sight-item-lt"></div>
            <div className="detector-sight-item sight-item-rt"></div>
            <div className="detector-sight-item sight-item-lb"></div>
            <div className="detector-sight-item sight-item-rb"></div>
            <div className="detector-sight-scan"></div>
          </div>
        </div>
      </div>
    );
  }
}
