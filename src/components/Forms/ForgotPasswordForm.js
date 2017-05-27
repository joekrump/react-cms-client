// src/components/Forms/ForgotPasswordForm.js
import React from 'react';
import ResourceForm from './ResourceForm';

class ForgotPassword extends React.Component {
  render() {
    return (
      <ResourceForm 
        formName="forgotPasswordForm" 
        resourceURL="recovery"
        resourceId={null}
        editContext="new"
        buttonText="Send Reset Link"
      />
    )
  }
}

export default ForgotPassword;
