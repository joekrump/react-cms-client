import React from 'react';

const AudioEntity = (props) => {
  return <audio controls src={props.src} style={styles.media} />;
};

export default AudioEntity;

const styles = {
  media: {
    width: '100%'
  }
}