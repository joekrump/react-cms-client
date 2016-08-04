import request from 'superagent';
import AppConfig from '../../../../config/app'

import React from 'react';
import { UserWidget } from '../../Dashboard/UserWidget' 
import CircularProgress from 'material-ui/CircularProgress';

import FlexContainer from '../../Layout/FlexContainer';

const Dashboard = React.createClass({
  getInitialState(){
    return {
      users: null
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
        } else {
          this.setState({users: res.body.users})
        }
      }.bind(this))
  },
  render() {
    return (
      <div className="dashboard">
        <div>
          <h1>Dashboard</h1>
          <p>Congrats, you are logged in!</p>
        </div>
        <FlexContainer>
          {this.state.userCount !== null ? <UserWidget users={this.state.users} /> : <CircularProgress />}
        </FlexContainer>
      </div>
    );
  }
});
export default Dashboard;