// src/components/Form/Form.js
import React from 'react';

const Form = (props) => (
  <form onSubmit={props.onSubmit}>
    { props.children }
  </form>
);

export { Form };
