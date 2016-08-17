import React from 'react';

const VideoEntity = (props) => {
  return <video controls src={props.src} style={styles.media} />;
};

export default VideoEntity;


const styles = {
  media: {
    width: '100%'
  }
}