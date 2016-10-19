import React from 'react';
import ResourceForm from './ResourceForm';
import { connect } from 'react-redux'

class ResetPassword extends React.Component {
  loginNewUser(user, token){
    this.props.loginUser(user, token, '/admin');
  }

  render() {
    return (
      <ResourceForm 
        formName="resetPasswordForm" 
        resourceURL="auth/reset-password"
        resourceId={null}
        editContext="new"
        loginCallback={(user, token) => this.loginNewUser()}
        buttonText="Reset Password"
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
)(ResetPassword)