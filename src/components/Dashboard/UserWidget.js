// src/components/Form/Form.js
import React from 'react';
import Gravatar from '../Nav/Gravatar';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import LensIcon from 'material-ui/svg-icons/image/lens';
import {redA700, lightGreenA400} from 'material-ui/styles/colors';
const UserWidget = () => ({
  

  render() {
    var usersSection = null;

    if(this.props.users) {
      usersSection = this.props.users.map((user) => {
        return (
          <ListItem key={user.id}
                  primaryText={user.name}
                  leftAvatar={<Gravatar email={user.email} diameter='50' />}
                  rightIcon={ <LensIcon color={user.logged_in ? lightGreenA400 : redA700} style={{height: '16px', padding: '4px 4px'}}/>}
                  disabled
                />
        )
      })
      usersSection = (
        <List style={{width: '50%'}}>
          {usersSection}
        </List>)
    }

    return (
      <div>
        <h2>Users</h2>
        {usersSection}
      </div>
    );
  }
});

export { UserWidget }