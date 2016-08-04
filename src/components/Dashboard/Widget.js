// src/components/Form/Form.js
import React from 'react';
import Paper from 'material-ui/Paper';
// import CircularProgress from 'material-ui/CircularProgress';

import './Widget.css'

const Widget = (props) => ({

  render() {
    
    // Will be blank if there are no other users online, otherwise will show widget.
    return ( 
      <Paper zDepth={2} className="widget">
        <h2>{this.props.name}</h2>
        {props.children}
      </Paper>
    );
  }
});

export default Widget;