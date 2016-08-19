import React from 'react';

const AudioEntity = (props) => {
  return <audio controls src={props.src} style={props.style} />;
};

export default AudioEntity;