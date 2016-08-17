import React from 'react';
import AudioEntity from './AudioEntity';
import VideoEntity from './VideoEntity';
import ImageEntity from './ImageEntity';
import { Entity } from 'draft-js';

const MediaEntity = (props) => {
  const entity = Entity.get(props.block.getEntityAt(0));
  const {src} = entity.getData();
  const type = entity.getType();

  let media;

  if (type === 'audio') {
    media = <AudioEntity src={src} />;
  } else if (type === 'image') {
    media = <ImageEntity src={src} />;
  } else if (type === 'video') {
    media = <VideoEntity src={src} />;
  }

  return media;
};

export default MediaEntity;