// src/components/Form/Form.js
import React, {PropTypes} from 'react';

const Form = () => ({
  render() {
    return (
      <form>
        {this.props.children}
      </form>
    );
  }
});

export { Form }