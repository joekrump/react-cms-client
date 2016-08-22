import React from 'react';
import Resizable from '../Resizable/Resizable';
import ResizableBox from '../Resizable/ResizableBox';
import {getResizeHandleColor} from '../../helpers/ImageHelper';

class ImageEntity extends React.Component {

  state = {
    width: 24,
    height: 24,
    resizeHandleColor: '#000'
  }

  onResize = (event, {element, size}) => {
    this.setState({width: size.width, height: size.height});
  };

  handleImageResized = (event) => {
    // console.log('inner image resized')
    // console.log(event.target.width);
  };

  componentDidMount() {
    var insertedImage = new Image();
    
    insertedImage.addEventListener('load', (event) => {
      let resizeHandleColor = getResizeHandleColor(insertedImage);
      console.log(resizeHandleColor);
      this.setState({
        resizeHandleColor,
        width: event.target.width,
        height: event.target.height
      });
    }, false);

    insertedImage.src = this.props.src;

  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextState.height !== this.state.height) && (nextState.width !== this.state.width)
  }

  calcMinContstraints() {
    const minSize = 60; // 60px
    const ratio = this.state.width / this.state.height;
    if(ratio > 1) {
      return [60 * ratio, 60]
    } else {
      return [60, 60 / ratio]
    }
  }

  render() {

    return (
      <ResizableBox 
        width={this.state.width} 
        height={this.state.height} 
        lockAspectRatio={true} 
        onResize={this.onResize}
        maxConstraints={[this.props.maxWidth, this.props.maxHeight]}
        minConstraints={this.calcMinContstraints()}
        resizeHandleColor={this.state.resizeHandleColor}
      >
        <img src={this.props.src} style={{...this.props.style}} onResize={this.handleImageResized}/>
      </ResizableBox>
    )
  }
}

export default ImageEntity;