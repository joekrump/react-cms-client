import React from 'react';

import IconButton from 'material-ui/IconButton';
import FormatAlignLeft from 'material-ui/svg-icons/editor/format-align-left';
import FormatAlignRight from 'material-ui/svg-icons/editor/format-align-right';
import FormatAlignCenter from 'material-ui/svg-icons/editor/format-align-center';

const InlineImageControls = (props) => {

  return (
    <div style={{position: 'absolute', width: '100%', top: 10, right: 0}}>
      <div style={{position: 'relative', width: 200, margin: '0 auto', top: 10, right: 0, zIndex: 40, backgroundColor: 'rgba(0,0,0,0.7)', color: '#fff', padding: 10, textAlign: 'center'}}>
        <IconButton onTouchTap={props.handleAlignLeft}>
          <FormatAlignLeft />
        </IconButton>
        <IconButton onTouchTap={props.handleAlignCenter}>
          <FormatAlignCenter />
        </IconButton>
        <IconButton onTouchTap={props.handleAlignRight}>
          <FormatAlignRight />
        </IconButton>
      </div>
    </div>
  )

}

export default InlineImageControls;