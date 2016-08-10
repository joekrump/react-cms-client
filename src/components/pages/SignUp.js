import React from 'react'
import ResourceForm from '../Forms/ResourceForm';

const SignUp = () => ({
  
  render() {
    return (

      <div className="user-signup">
        <h1>Sign Up</h1>

        <ResourceForm 
          formName={'signupForm'} 
          submitUrl={'auth/signup'}
          resourceType='user'
          context='new'
        />
      </div>
    );
  }
});

export default SignUp