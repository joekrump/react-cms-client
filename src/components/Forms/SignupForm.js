import React from 'react';
import ResourceForm from './ResourceForm';

class SignupForm extends React.Component {
  render() {
    return (
      <ResourceForm 
        formName="signupForm" 
        resourceURL="auth/signup"
        resourceId={null}
        editContext={editContext}
      />
    )
  }
}

export default SignupForm