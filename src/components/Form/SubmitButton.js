// src/components/Form/SubmitButton.js
import React, { PropTypes } from 'react';
import RaisedButton from 'material-ui/RaisedButton';

export default React.createClass({

  displayName: 'SubmitButton',

  propTypes: {
    label: PropTypes.string
  },

  contextTypes: {
    isFormValid: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired
  },

  getDefaultProps() {
    return {
      label: 'Submit'
    };
  },

  render() {
    return (
      <RaisedButton
        primary
        disabled={!this.context.isFormValid()}
        label={this.props.label}
        onTouchTap={this.context.submit}/>
    );
  }
});