import React from 'react';
import ResourceForm from './ResourceForm';
import { connect } from 'react-redux'

class ResetPassword extends React.Component {
  loginNewUser(user, token){
    // this.props.loginUser(user, token, '/admin');
    // TODO:
    // 
    // run some process that will log the user into the system
    // resetting the password will log the user in on the server 
    // and should return a token and the logged in user's data.
  }

  render() {
    console.log(this.state)
    return (
      <ResourceForm 
        formName="resetPasswordForm" 
        resourceURL="reset"
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

const mapStateToProps = (state) => ({
  reset_token: state.routing.locationBeforeTransitions.query._t,
  reset_email: state.routing.locationBeforeTransitions.query.email
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResetPassword)