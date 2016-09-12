import React from 'react'
import Gravatar from '../Nav/Gravatar';
import { List, ListItem } from 'material-ui/List';
import LensIcon from 'material-ui/svg-icons/image/lens';
import { lightGreenA400 } from 'material-ui/styles/colors';
import { apiGet, updateToken } from '../../http/requests'

import CircularProgress from 'material-ui/CircularProgress';
import './Widget.css'
import { connect } from 'react-redux';

class ActiveUsersWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
  }
  componentDidMount(){
    apiGet('users/active')
      .end(function(err, res) {
        if(err){
          console.log("error", err);
        } else if(res.statusCode !== 200) {
        } else {
          updateToken(res.header.authorization);
          this.setState({data: res.body.activeUsers})
        }
      }.bind(this))
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

const mapStateToProps = ( state ) => {
  return {
    token: state.auth.token
  }
}

export default connect(
  mapStateToProps
)(ActiveUsersWidget);