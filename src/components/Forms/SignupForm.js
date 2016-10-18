import React from 'react';
import ResourceForm from './ResourceForm';

class SignupForm extends React.Component {
  loginNewUser($user, $token){
    this.props.loginUser($user, $token, '/admin');
  },
  render() {
    return (
      <ResourceForm 
        formName="signupForm" 
        resourceURL="auth/signup"
        resourceId={null}
        editContext="new"
        loginCallback={this.loginNewUser.bind(this)}
      />
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loginUser: (user, token, redirectPath) => {
      dispatch ({
        type: 'USER_LOGGED_IN',
        user,
        token,
        redirectPath
      })
    }
  }
}

export default connect(null,
  mapDispatchToProps
)(SignupForm)