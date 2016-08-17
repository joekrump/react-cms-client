import React from 'react';

const ImageEntity = (props) => {
  return <img src={props.src} style={styles.media} />;
};

export default ImageEntity;

const styles = {
  media: {
    width: '100%'
  }
}