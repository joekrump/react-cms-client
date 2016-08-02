import request from 'superagent';
import AppConfig from '../../../../config/app'

import React from 'react';
import { UserWidget } from '../../Dashboard/UserWidget' 

const Dashboard = React.createClass({
  getInitialState(){
    return {
      userCount: null
    }
  },
  componentDidMount(){
    request.get(AppConfig.apiBaseUrl + 'dashboard')
      .set('Access-Control-Allow-Origin', AppConfig.baseUrl)
      .set('Authorization', 'Bearer ' + sessionStorage.laravelAccessToken)
      .set('Accept', 'application/json')
      .end(function(err, res) {
        if(err){
          console.log("error", err);
        } else if(res.statusCode !== 200) {
          console.log('errorCode', res);
        } else {
          console.log(res);
          this.setState({userCount: res.body.userCount})
        }
      }.bind(this))
  },
  render() {
    return (
      <div>
        <h1>Dashboard</h1>
        <p>Congrats, you are logged in</p>
        {this.props.children}
        {this.state.userCount !== null ? <UserWidget userCount={this.state.userCount} /> : null}
      </div>
    );
  }
});
export default Dashboard;