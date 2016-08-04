import request from 'superagent';
import AppConfig from '../../../../config/app'

import React from 'react';
import Widget from '../../Dashboard/Widget' 
import CircularProgress from 'material-ui/CircularProgress';

import FlexContainer from '../../Layout/FlexContainer';

const Dashboard = React.createClass({
  getInitialState(){
    return {
      widgetData: [],
      widgets: []
    }
  },
  componentDidMount(){
    request.get(AppConfig.apiBaseUrl + 'dashboard')
      .set('Access-Control-Allow-Origin', AppConfig.baseUrl)
      .set('Authorization', 'Bearer ' + sessionStorage.laravelAccessToken)
      .end(function(err, res) {
        if(err){
          console.log("error", err);
        } else if(res.statusCode !== 200) {
        } else {
          this.setState({widgetData: res.body.widgetData, widgets: res.body.widgets})
        }
      }.bind(this))
  },
  render() {
    var DashboardWidgets = null;
    if(this.state.widgets.length > 0){
      DashboardWidgets = this.state.widgets.map((widget)=>(
        <Widget key={widget.id} style={{flex: widget.size + ' auto'}} data={this.state.widgetData[widget.id]}/>
      ));
    }

    return (
      <div className="dashboard">
        <div>
          <h1>Dashboard</h1>
          <p>Congrats, you are logged in!</p>
        </div>
        <FlexContainer>
          {DashboardWidgets}
        </FlexContainer>
      </div>
    );
  }
});
export default Dashboard;