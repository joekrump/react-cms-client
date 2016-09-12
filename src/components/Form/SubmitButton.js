// src/components/Form/SubmitButton.js
import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import SendIcon from 'material-ui/svg-icons/content/send';

const SubmitButton = (props) => (
  <RaisedButton
    primary
    disabled={!props.isFormValid}
    label={props.label ? props.label : 'Submit'}
    type="submit"
    icon={props.withIcon ? (<SendIcon />) : null}
  />
);

export default SubmitButton;