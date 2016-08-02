// src/components/Form/Form.js
import React from 'react';

const UserWidget = () => ({
  render() {
    return (
      <div>
        <h2>Users</h2>
        <p>{this.props.userCount === 1 ? 'There is 1 user.' : 'There are ' + this.props.userCount + ' users.'}</p>
      </div>
    );
  }
});

export { UserWidget }