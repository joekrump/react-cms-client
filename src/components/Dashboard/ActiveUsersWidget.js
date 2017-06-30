// src/components/Dashboard/ActiveUsersWidget.js
import React from 'react';
import Gravatar from '../Menu/AdminMenu/Gravatar';
import { List, ListItem } from 'material-ui/List';
import LensIcon from 'material-ui/svg-icons/image/lens';
import { lightGreenA400 } from 'material-ui/styles/colors';
import { APIClient } from '../../http/requests';
import CircularProgress from 'material-ui/CircularProgress';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Widget.scss';
import { connect } from 'react-redux';

class ActiveUsersWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    const client = new APIClient(this.props.dispatch);
    client.get('users/active').then((res) => {
      if (res.statusCode !== 200) {
        console.warn('error', res);
      } else {
        client.updateToken(res.header.authorization);
        this.setState({ data: res.body.data });
      }
    }).catch((res) => {
      console.warn('error', res);
    });
  }

  render() {
    let usersSection = null;

    if (this.state.data && (this.state.data.length > 0)) {
      const userListItems = this.state.data.map((user, i) => {
        return (
          <ListItem
            key={`user-${i}`}
            primaryText={user.name}
            leftAvatar={<Gravatar email={user.email} diameter='50' style={{ left: '0' }} />}
            rightIcon={ <LensIcon color={lightGreenA400} style={{ height: '16px', padding: '4px 4px' }} />}
            disabled
            style={{ paddingLeft: '50px' }}
          />
        );
      });
      usersSection = (
        <div className="widget">
          <h2 className="widget-title">{this.props.name}</h2>
          {this.state.data.length === 0 ? (<CircularProgress />) :
            <List>
              { userListItems }
            </List>
          }
        </div>
      );
    }

    return ( usersSection )
  }
}

// call connect so that we have access to dispatch in props
export default withStyles(s)(connect()(ActiveUsersWidget));
