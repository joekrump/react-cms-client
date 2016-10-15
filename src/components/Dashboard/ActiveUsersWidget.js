import React from 'react'
import Gravatar from '../Menu/Gravatar';
import { List, ListItem } from 'material-ui/List';
import LensIcon from 'material-ui/svg-icons/image/lens';
import { lightGreenA400 } from 'material-ui/styles/colors';
import APIClient from '../../http/requests'
import CircularProgress from 'material-ui/CircularProgress';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Widget.scss'
import { connect } from 'react-redux';

class ActiveUsersWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
  }
  componentDidMount(){
    let client = new APIClient(this.context.store);
    client.get('users/active').then((res) => {
      if(res.statusCode !== 200) {
        // Couldn't get the active users for some reason. Likely something wrong with the API server.
      } else {
        client.updateToken(res.header.authorization);
        this.setState({data: res.body.activeUsers})
      }
    }).catch((res) => {
      console.log("error", res);
    })
  }
  render() {

    var usersSection = null;

    if(this.state.data && (this.state.data.length > 0)) {
      usersSection = this.state.data.map((user) => {
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
        <div className="widget">
          <h2>{this.props.name}</h2>
          {this.state.data.length === 0 ? (<CircularProgress />) :
            <List>
              {usersSection}
            </List>
          }
        </div>
      );
    }

    return ( usersSection )
  }
}

ActiveUsersWidget.contextTypes = {
  store: React.PropTypes.object
}

const mapStateToProps = ( state ) => {
  return {
    token: state.auth.token
  }
}

export default withStyles(s)(
  connect(mapStateToProps)(ActiveUsersWidget)
);