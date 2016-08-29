import React from 'react';
import AudioEntity from './AudioEntity';
import VideoEntity from './VideoEntity';
import ImageEntity from './ImageEntity';
import { Entity } from 'draft-js';

const style = {
  width: '100%'
}

class MediaEntity extends React.Component {
  state = {
    visible: true
  }
  removeCallback = () => {
    this.setState({visible: false})
  }
  render() {
    let entity = Entity.get(this.props.block.getEntityAt(0));
    let {src, removeCallback} = entity.getData();
    let type = entity.getType();
    let media;

    if (type === 'audio') {
      media = <AudioEntity src={src} style={style}/>;
    } else if (type === 'image') {

      let editorContainer = document.getElementsByClassName('RichEditor-editor')[0];
      media = this.state.visible ? <ImageEntity src={src} 
                style={style} 
                maxWidth={editorContainer.clientWidth} 
                maxHeight={window.innerHeight - 150} 
                block={this.props.block} 
                removeCallback={this.removeCallback} 
                width={this.props.width} 
                height={this.props.height} 
              /> : null;
    } else if (type === 'video') {
      media = <VideoEntity src={src} style={style}/>;
    }

    return media;
  }
  
}

export default MediaEntity;