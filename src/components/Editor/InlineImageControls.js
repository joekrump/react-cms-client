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

  if(props.alignment === 'left'){
    style.left = 0;
    delete style.right
  } else {
    style.right = 0;
    delete style.left
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

  if(props.currentImageWidth < 260) {
    style.bottom = 0;
    delete style.top
  } else {
    style.top = 10;
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