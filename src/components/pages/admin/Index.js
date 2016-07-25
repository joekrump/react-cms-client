import React from 'react';

const Index = React.createClass({
  render() {
    return (

      <div className="admin-index">
        <h1>Index Page</h1>
        {this.props.children}
      </div>
    );
  }
  
});
export default Index;