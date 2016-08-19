import React from 'react';
import Resizable from '../Resizable/Resizable';
import ResizableBox from '../Resizable/ResizableBox';


import './css/Resizable.css';

class ImageEntity extends React.Component {

  state = {width: 200, height: 200};

  onClick = () => {
    this.setState({width: 200, height: 200});
  };

  onResize = (event, {element, size}) => {
    this.setState({width: size.width, height: size.height});
  };

  render() {
    return (
      <ResizableBox className="box" height={600} width={600} lockAspectRatio={true} onResize={this.onResize}>
        <img src={this.props.src} style={{...this.props.style, 'padding': '10px'}} />
      </ResizableBox>
    )
  }
}

export default ImageEntity;