import React from 'react';
import Resizable from '../Resizable/Resizable';
import ResizableBox from '../Resizable/ResizableBox';


class ImageEntity extends React.Component {

  state = {
    width: 20,
    height: 20
  }

  onResize = (event, {element, size}) => {
    this.setState({width: size.width, height: size.height});
  };

  componentDidMount() {
    var myImage = new Image();
    myImage.src = this.props.src;
    myImage.addEventListener('load', (event) => {
      this.setState({
        width: event.target.width,
        height: event.target.height
      });
    }, false);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextState.height !== this.state.height) && (nextState.width !== this.state.width)
  }

  render() {
    console.log('render', this.state)
    return (
      <ResizableBox width={this.state.width} height={this.state.height} lockAspectRatio={true} onResize={this.onResize}>
        <img src={this.props.src} style={{...this.props.style}} />
      </ResizableBox>
    )
  }
}

export default ImageEntity;