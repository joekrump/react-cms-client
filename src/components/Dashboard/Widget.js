// src/components/Dashboard/Widget.js
import React from 'react';
import Paper from 'material-ui/Paper';

const Widget = (props) => ({

  render() {
    return ( 
      <Paper zDepth={2} className="widget-wrapper">
        {props.children}
      </Paper>
    );
  }
});

export default Widget;
