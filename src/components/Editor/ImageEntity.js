import React from 'react';
import {getIconColor} from '../../helpers/ImageHelper';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import InlineImageControls from './InlineImageControls';
import Resizable from 'react-resizable-box'

import './ImageEntity.css'

const isResizable = {
  top:false, right:false, bottom:false, left:false, topRight:false, bottomRight:true, bottomLeft:true, topLeft:false
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

  onResize = (event, {element, size}) => {
    this.setState({width: size.width, height: size.height});
  };

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


      this.setState({
        width: event.target.width,
        height: event.target.height,
        ratio: (event.target.width / event.target.height),
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

  getMinConstraints() {
    const minSize = 60; // 60px
    if(this.state.ratio > 1) {
      return {
        x: (minSize * this.state.ratio),
        y: minSize
      }
    } else {
      return {
        x: minSize, 
        y: (minSize / this.state.ratio)
      }
    }
  }

  getMaxConstraints(){
    let x, y;

    if(this.state.ratio > 1) {
      x = this.props.maxWidth > this.state.width ? this.state.width : this.props.maxWidth
      return {
        x: x,
        y: (x / this.state.ratio)
      }
    } else {
      y = this.props.maxHeight > this.state.height ? this.state.height : this.props.maxHeight
      return {
        x: (y * this.state.ratio),
        y: y
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
        x={0}
        y={0}
        width={maxConstraints.x}
        height={maxConstraints.y}
        maxWidth={maxConstraints.x}
        maxHeight={maxConstraints.y}
        isResizable={{ ...isResizable }}
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

        <img src={this.props.src} style={{...this.props.style}} />
      </Resizable>
    )
  }
}

export default ImageEntity;