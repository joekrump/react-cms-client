import React from 'react';
import ResourceForm from './ResourceForm';
import { connect } from 'react-redux'

class ResetPassword extends React.Component {
  loginNewUser(user, token){
    console.log('User: ', user);
    console.log('Token: ', token)
    // this.props.loginUser(user, token, '/admin');
    // TODO:
    // 
    // run some process that will log the user into the system
    // resetting the password will log the user in on the server 
    // and should return a token and the logged in user's data.
  }

  componentDidMount() {

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
    },
    updateForm: (reset_token, reset_email) => {
      dispatch({
        type: 'FORM_INPUT_CHANGE',
        value: reset_token,
        fieldName: 'token',
        formName: 'resetPasswordForm',
        errors: []
      })
      dispatch({
        type: 'FORM_INPUT_CHANGE',
        value: reset_email,
        fieldName: 'email',
        formName: 'resetPasswordForm',
        errors: []
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