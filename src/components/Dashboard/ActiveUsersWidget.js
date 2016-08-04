import React from 'react'
import request from 'superagent'
import AppConfig from '../../../../config/app'

const ActiveUsersWidget = React.createClass({
  getInitialState(){
    return {
      data: []
    }
  },
  componentDidMount(){
    request.get(AppConfig.apiBaseUrl + 'users/active')
      .set('Access-Control-Allow-Origin', AppConfig.baseUrl)
      .set('Authorization', 'Bearer ' + sessionStorage.laravelAccessToken)
      .end(function(err, res) {
        if(err){
          console.log("error", err);
        } else if(res.statusCode !== 200) {
        } else {
          this.setState({data: res.body.activeUsers})
        }
      }.bind(this))
  },
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
        <List>
          {usersSection}
        </List>
      );
    }

    return ( usersSection )
  }
});

export default ActiveUsersWidget;