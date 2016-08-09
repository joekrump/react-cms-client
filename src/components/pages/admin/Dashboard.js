import request from 'superagent';
import AppConfig from '../../../../app_config/app'

import React from 'react';
import Widget from '../../Dashboard/Widget' 
import ActiveUsersWidget from '../../Dashboard/ActiveUsersWidget' 

import FlexContainer from '../../Layout/FlexContainer';

const Dashboard = React.createClass({
  getInitialState(){
    return {
      widgets: []
    }
  },
  componentDidMount(){
    request.get(AppConfig.apiBaseUrl + 'dashboard')
      // .set('Access-Control-Allow-Origin', AppConfig.baseUrl)
      .set('Authorization', 'Bearer ' + sessionStorage.laravelAccessToken)
      .end(function(err, res) {
        if(err){
          console.log("error", err);
        } else if(res.statusCode !== 200) {
        } else {
          this.setState({widgets: res.body.widgets})
        }
      }.bind(this))
  },
  render() {
    var DashboardWidgets = null;
    var widgetComponent = null;

    if(this.state.widgets.length > 0){
      
      DashboardWidgets = this.state.widgets.map((widget)=> {
        console.log(widget.component_name);
        switch (widget.component_name) {
          case 'ActiveUsersWidget':
            widgetComponent = (<ActiveUsersWidget name={widget.name} />);
            break;
          default:
            widgetComponent = null;
            break;
        }

        if(widgetComponent === null) {
          return null;
        } else {
          return (
            <Widget key={widget.id} style={{flex: widget.size + ' auto'}} name={widget.name} >
              {widgetComponent}
            </Widget>
          )
        }
      })
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