import React from 'react';
import ResourceForm from './ResourceForm';
import { connect } from 'react-redux'

class ResetPassword extends React.Component {
  loginNewUser(user, token){
    this.props.loginUser(user, token, true, '/admin');
  }

  componentDidMount() {
    this.props.updateForm(this.props.reset_token, this.props.reset_email);
  }

  render() {
    return (
      <ResourceForm 
        formName="resetPasswordForm" 
        resourceURL="reset"
        resourceId={null}
        editContext="new"
        successCallback={(user, token) => this.loginNewUser(user, token)}
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