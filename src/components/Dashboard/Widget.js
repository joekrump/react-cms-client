// src/components/Form/Form.js
import React from 'react';
import Gravatar from '../Nav/Gravatar';
import { List, ListItem } from 'material-ui/List';
import LensIcon from 'material-ui/svg-icons/image/lens';
import { lightGreenA400 } from 'material-ui/styles/colors';
import Paper from 'material-ui/Paper';

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