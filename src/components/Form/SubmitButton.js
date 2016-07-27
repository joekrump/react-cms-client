// src/components/Form/SubmitButton.js
import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import SendIcon from 'material-ui/svg-icons/content/send';

export default React.createClass({

  getDefaultProps() {
    return {
      label: 'Submit'
    };
  },

  render() {
    return (
      <RaisedButton
        primary
        disabled={!this.props.isFormValid}
        label={this.props.label}
        type="submit"
        icon={this.props.withIcon ? (<SendIcon />) : null}
        />
    );
  }
});