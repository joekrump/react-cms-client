import React from 'react';

const VideoEntity = (props) => {
  return <video controls src={props.src} style={props.style} />;
};

export default VideoEntity;