// src/components/Form/Form.js
import React from 'react';
import Gravatar from '../Nav/Gravatar';
import { List, ListItem } from 'material-ui/List';
import LensIcon from 'material-ui/svg-icons/image/lens';
import { lightGreenA400 } from 'material-ui/styles/colors';
import Paper from 'material-ui/Paper';

import './Widget.css'

const Widget = () => ({

  render() {
    var usersSection = null;

    if(this.props.data && (this.props.data.length > 0)) {
      usersSection = this.props.data.map((user) => {
        return (
          <ListItem key={user.id}
            primaryText={user.name}
            leftAvatar={<Gravatar email={user.email} diameter='50' style={{left: '0'}} />}
            rightIcon={ <LensIcon color={lightGreenA400} style={{height: '16px', padding: '4px 4px'}}/>}
            disabled
            style={{paddingLeft: '50px'}}
          />
        )
      })
      usersSection = (
        <Paper zDepth={2}  className="widget">
          <h2>{this.props.name}</h2>
          <List>
            {usersSection}
          </List>
        </Paper>
      );
    }

    // Will be blank if there are no other users online, otherwise will show widget.
    return ( usersSection );
  }
});

export default Widget;