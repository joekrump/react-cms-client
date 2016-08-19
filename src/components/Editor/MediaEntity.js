import React from 'react';
import AudioEntity from './AudioEntity';
import VideoEntity from './VideoEntity';
import ImageEntity from './ImageEntity';
import { Entity } from 'draft-js';

const style = {
  width: '100%'
}

const MediaEntity = (props) => {
  const entity = Entity.get(props.block.getEntityAt(0));
  const {src} = entity.getData();
  const type = entity.getType();

  let media;

  if (type === 'audio') {
    media = <AudioEntity src={src} style={style}/>;
  } else if (type === 'image') {
    let editorContainer = document.getElementsByClassName('RichEditor-editor')[0];
    media = <ImageEntity src={src} style={style} maxWidth={editorContainer.clientWidth} maxHeight={window.innerHeight}/>;
  } else if (type === 'video') {
    media = <VideoEntity src={src} style={style}/>;
  }

  return media;
};




export default MediaEntity;