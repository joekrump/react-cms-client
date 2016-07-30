// src/components/Form/Form.js
import React from 'react';

const Form = () => ({
  render() {
    return (
      <form onSubmit={this.props.onSubmit}>
        {this.props.children}
      </form>
    );
  }
});

export { Form }