import React from 'react'
import Widget from '../../../Dashboard/Widget' 
import ActiveUsersWidget from '../../../Dashboard/ActiveUsersWidget' 
import FlexContainer from '../../../Layout/FlexContainer'
import APIClient from '../../../../http/requests'
import AdminLayout from '../Layout/AdminLayout'

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      widgets: []
    }
  }

  componentDidMount(){
    let client = new APIClient(this.context.store);
    client.get('dashboard').then((res) => {
      if(res.statusCode !== 200) {
      } else {
        this.setState({widgets: res.body.widgets})
        client.updateToken(res.headers.authorization);
      }
    })
    .catch((res) => {
      console.log("Something went wrong unexpectedly: ", res);
    })
  }
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
      <AdminLayout>
        <div className="dashboard">
          <div>
            <h1>Dashboard</h1>
            <p>Congrats, you are logged in!</p>
          </div>
          <FlexContainer>
            {DashboardWidgets}
          </FlexContainer>
        </div>
      </AdminLayout>
    );
  }
}

Dashboard.contextTypes = {
  store: React.PropTypes.object.isRequired
};

export default Dashboard;