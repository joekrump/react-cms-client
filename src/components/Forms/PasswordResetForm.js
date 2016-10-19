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
      />
    )
  }
}

export default PasswordReset;