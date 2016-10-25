import React from 'react';
import ResourceForm from './ResourceForm';

class ForgotPassword extends React.Component {
  render() {
    return (
      <ResourceForm 
        formName="forgotPasswordForm" 
        resourceURL="auth/forgot-password"
        resourceId={null}
        editContext="new"
        buttonText="Send Reset Link"
      />
    )
  }
}

export default ForgotPassword;