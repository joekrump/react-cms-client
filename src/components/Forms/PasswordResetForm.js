import React from 'react';
import ResourceForm from './ResourceForm';

class PasswordReset extends React.Component {
  render() {
    return (
      <ResourceForm 
        formName="passwordResetForm" 
        resourceURL="auth/password-reset"
        resourceId={null}
        editContext="new"
        buttonText="Send Reset Link"
      />
    )
  }
}

export default PasswordReset;