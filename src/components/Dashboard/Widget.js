// src/components/Form/Form.js
import React from 'react';
import Paper from 'material-ui/Paper';

const Widget = (props) => ({

  render() {
    
    // Will be blank if there are no other users online, otherwise will show widget.
    return ( 
      <Paper zDepth={2} className="widget-wrapper">
        {props.children}
      </Paper>
    );
  }
});

export default Widget;