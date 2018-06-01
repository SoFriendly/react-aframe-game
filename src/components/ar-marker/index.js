import React from 'react';
import ArucoMarker from 'aruco-marker';

import './index.css';

class ARMarker extends React.Component {

  componentDidMount() {
    const { id } = this.props;

    this.renderMarker(id);
  }

  renderMarker = (id) => {
    id = id || Math.floor(Math.random() * 1024);
    const el = document.getElementById('ar-marker');
    el.innerHTML = '<p>Marker ID: ' + id + '</p>' + new ArucoMarker(id).toSVG('300px');
  }

  render() {
    return (
      <div id="ar-marker"></div>
    );
  }
};


export default ARMarker;
