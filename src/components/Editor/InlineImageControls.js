import React from 'react';

import IconButton from 'material-ui/IconButton';
import FormatAlignLeft from 'material-ui/svg-icons/editor/format-align-left';
import FormatAlignRight from 'material-ui/svg-icons/editor/format-align-right';
import FormatAlignCenter from 'material-ui/svg-icons/editor/format-align-center';

const InlineImageControls = (props) => {

  let style = {
    position: 'absolute', 
    width: '100%', 
    top: 0, 
  }

  let toolbarStyle = {
    position: 'relative', 
    width: 200, 
    margin: '0 auto', 
    right: 0, 
    zIndex: 40, 
    backgroundColor: 'rgba(0,0,0,0.7)', 
    color: '#fff', 
    padding: 10, 
    textAlign: 'center'
  }

  if(props.alignment === 'left'){
    delete style.left
    delete toolbarStyle.right
    
    style.right = 0;
    toolbarStyle.left = 0;
  } else {
    delete style.right
    delete toolbarStyle.left

    style.left = 0;
    toolbarStyle.right = 0;
  }

  if(props.currentImageWidth < 260) {
    style.bottom = 0;
    toolbarStyle.bottom = 0;
    toolbarStyle.position = 'absolute'
    delete style.top
  } else {
    style.top = 10;
    toolbarStyle.position = 'relative'
    delete style.bottom
  }

  return (
    <div className="image-editor-control"  style={{...style}}>
      <div style={{...toolbarStyle}}>
        <IconButton onTouchTap={props.handleAlignLeft}
          tooltip="Align Left"
          tooltipPosition="top-center"
        >
          <FormatAlignLeft />
        </IconButton>
        <IconButton onTouchTap={props.handleAlignCenter}
          tooltip="Center"
          tooltipPosition="top-center"
        >
          <FormatAlignCenter />
        </IconButton>
        <IconButton onTouchTap={props.handleAlignRight}
          tooltip="Align Right"
          tooltipPosition="top-center"
        >
          <FormatAlignRight />
        </IconButton>
      </div>
    </div>
  )

}

export default InlineImageControls;