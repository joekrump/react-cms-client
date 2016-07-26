import React from 'react';

const Dashboard = React.createClass({
  render() {
    return (
      <div>
        <h1>Dashboard</h1>
        <p>Congrats, you are logged in</p>
        {this.props.children}
      </div>
    );
  }
});
export default Dashboard;