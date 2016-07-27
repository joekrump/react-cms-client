// src/components/Form/Form.js
import React, {PropTypes} from 'react';

export default React.createClass({
  
  displayName: 'Form',

  propTypes: {
    children: PropTypes.node,
    values: PropTypes.object,
    update: PropTypes.func,
    reset: PropTypes.func,
    onSubmit: PropTypes.func
  },


  render() {
    return (
      <form>
        {this.props.children}
      </form>
    );
  }
});