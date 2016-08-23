import React from 'react';
import {getIconColor} from '../../helpers/ImageHelper';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import InlineImageControls from './InlineImageControls';
import Resizable from '../Resizable/Resizable'

import './ImageEntity.css'

const isResizable = {
  top: false, 
  right: false, 
  bottom: false, 
  left: true, 
  topRight: false, 
  bottomRight:true, 
  bottomLeft: true, 
  topLeft: false
}

const handleStyle = {
  bottomRight: {position: 'absolute', width: 10, height: 10, right: -10, bottom: -10, cursor: 'se-resize', border: '1px solid white'},
  bottomLeft: {position: 'absolute', width: 10, height: 10, left: -10, bottom: -10, cursor: 'ne-resize', border: '1px solid white'}
}

class ImageEntity extends React.Component {

  state = {
    width: this.props.width,
    height: this.props.height,
    ratio: 1,
    iconColors: {
      resizeHandle: '#000',
      deleteImage: '#000'
    },
    alignmentClass: 'left-align'
  }

  handleImageResized = (event) => {
    // console.log('inner image resized')
    // console.log(event.target.width);
  };

  componentDidMount() {
    const insertedImage = new Image(),
          resizeIconWidthHeight = 26,
          deleteIconWidthHeight  = 26;
    // Once the image loads get image control icon colors and set proper dimensions for the image
    // 
    insertedImage.addEventListener('load', (event) => {
      const resizeHandleColor = getIconColor(insertedImage, {
        x1: event.target.width - resizeIconWidthHeight, 
        y1: event.target.height - resizeIconWidthHeight,
        x2: event.target.width,
        y2: event.target.height
      });


      const deleteImageIconColor = getIconColor(insertedImage, {
        x1: event.target.width - deleteIconWidthHeight, 
        y1: 0,
        x2: event.target.width,
        y2: deleteIconWidthHeight
      });

      const maxConstraints = this.getMaxConstraints(event.target.width, event.target.height);
      this.setState({
        width: maxConstraints.x,
        height: maxConstraints.y,
        ratio: maxConstraints.ratio,
        iconColors: {
          resizeHandle: resizeHandleColor,
          deleteImage: deleteImageIconColor
        }
      });
    }, false);

    insertedImage.src = this.props.src;
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return (nextState.height !== this.state.height) && (nextState.width !== this.state.width)
  // }

  handleImageRemove = () => {
    const {block} = this.props
    this.props.removeCallback(block.getKey())
  }

  getMinConstraints(width, height) {
    const minSize = 60; // 60px
    const ratio = width / height;

    if(ratio > 1) {
      return {
        x: (minSize * ratio),
        y: minSize
      }
    } else {
      return {
        x: minSize, 
        y: (minSize / ratio),
        ratio: ratio
      }
    }
  }

  getMaxConstraints(width, height){
    let x, y;
    const ratio = width / height;

    if(ratio > 1) {
      x = this.props.maxWidth > width ? width : this.props.maxWidth
      return {
        x: x,
        y: (x / ratio),
        ratio: ratio
      }
    } else {
      y = this.props.maxHeight > height ? height : this.props.maxHeight
      return {
        x: (y * ratio),
        y: y,
        ratio: ratio
      }
    }
  }

  handleAlignLeft = (e) => {
    e.preventDefault();
    this.setState({
      alignmentClass: 'left-align'
    })
  }

  handleAlignRight = (e) => {
    e.preventDefault();
    this.setState({
      alignmentClass: 'right-align'
    })
  }

  handleAlignCenter = (e) => {
    e.preventDefault();
    this.setState({
      alignmentClass: 'center-align'
    })
  }

  render() {
    let maxConstraints = this.getMaxConstraints();

    return (
      <Resizable
        customClass={this.state.alignmentClass}
        width={this.state.width}
        height={this.state.height}
        maxWidth={this.state.width}
        maxHeight={this.state.height}
        isResizable={{ ...isResizable }}
        handleStyle={{ ...handleStyle }}
        // onResize={this.onResize}
        lockRatio={true}
        ratio={this.state.ratio}
      >
        <IconButton 
          className="image-delete-button"
          style={{position: 'absolute', top: 26, right: 2, width: 24, height: 24, padding: 0, zIndex: 40}} 
          tooltipStyles={{zIndex: 100, top: 16, right: 26}}
          tooltipPosition='top-left'
          iconStyle={{color: this.state.iconColors.deleteImage, width: 20, height: 20}}
          tooltip="Remove"
          onTouchTap={this.handleImageRemove}
        >
          <DeleteIcon />
        </IconButton>

        <InlineImageControls 
          handleAlignLeft={ this.handleAlignLeft }
          handleAlignRight={ this.handleAlignRight }
          handleAlignCenter={ this.handleAlignCenter }
        />

        <img src={this.props.src} style={{...this.props.style}}  />
      </Resizable>
    )
  }
}

export default ImageEntity;