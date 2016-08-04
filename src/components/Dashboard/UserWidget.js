// src/components/Form/Form.js
import React from 'react';
import Gravatar from '../Nav/Gravatar';
import { List, ListItem } from 'material-ui/List';
import LensIcon from 'material-ui/svg-icons/image/lens';
import { lightGreenA400 } from 'material-ui/styles/colors';

import './DesktopWidget.css'
import './UserWidget.css'

const UserWidget = () => ({

  render() {
    var usersSection = null;

    if(this.props.users && (this.props.users.length > 0)) {
      usersSection = this.props.users.map((user) => {
        return (
          <ListItem key={user.id}
            primaryText={user.name}
            leftAvatar={<Gravatar email={user.email} diameter='50' />}
            rightIcon={ <LensIcon color={lightGreenA400} style={{height: '16px', padding: '4px 4px'}}/>}
            disabled
          />
        )
      })
      usersSection = (
        <div className="widget user-widget">
          <h2>Other Users Online</h2>
          <List>
            {usersSection}
          </List>
        </div>
      );
    }

    // Will be blank if there are no other users online, otherwise will show widget.
    return ( usersSection );
  }
});

export { UserWidget }