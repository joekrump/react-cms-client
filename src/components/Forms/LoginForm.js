import React from 'react';
import { SubmitButton, TextInput } from '../Form/index';
import auth from '../../auth';
import { connect } from 'react-redux';
import ForgotPasswordLink from '../Pages/Auth/ForgotPassword/ForgotPasswordLink';
import NotificationSnackbar from '../Notifications/Snackbar/Snackbar'
import validations from '../../form-validation/validations'

class LoginForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: auth.loggedIn(),
      disabled: props.disabled
    };
  }

  loginCallback(authData, loggedIn) {
    if(!loggedIn){
      this.props.updateSnackbar(true, 'Error', 'Email and password combination not found', 'warning');
      return
    }

    const { location } = this.props
    let redirectPath;
    
    // If the user tried to access a specific admin route before logging in then redirect them there after login
    // otherwise default to /admin
    if(location && (location.pathname.toLowerCase() === '/login')) {
      redirectPath = '/admin'
    } else if(location && location.pathname) {
      redirectPath = location.pathname
    } else {
      redirectPath = '/admin'
    }
    this.props.loginUser(authData.user, authData.token, loggedIn, redirectPath);
  }

  handleSubmit(e){
    e.preventDefault()
    auth.login(
      this.props.formFields.email.value, 
      this.props.formFields.password.value, 
      (authData, loggedIn) => this.loginCallback(authData, loggedIn),
      this.props.dispatch
    )
  }

  getFieldValidationRules(fieldName){
    return validations.loginForm[fieldName].rules
  }

  render() {
    return (
      <div className="login-form-container" onSubmit={(event) => this.handleSubmit(event)}>
        <form className="login-form">
          <TextInput 
            type="text"
            placeholder="Email"
            label="Email"
            formName="loginForm"
            name="email"
            validationRules={this.getFieldValidationRules('email')} 
            autoFocus={true}
          />
          <TextInput 
            type="password"
            placeholder="Password"
            label="Password"
            formName="loginForm"
            name="password"
            validationRules={this.getFieldValidationRules('password')}
            autoFocus={false}
          />
          <SubmitButton isFormValid={this.props.isValid} withIcon={false} label="Login" />
          <NotificationSnackbar />
        </form>
        <br/>
        <ForgotPasswordLink />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loginUser: (user, token, loggedIn, redirectPath) => {
      dispatch ({
        type: 'USER_LOGGED_IN',
        user,
        token,
        loggedIn,
        redirectPath
      })
    },
    redirectAfterLogin: (callback) => {
      dispatch(callback)
    },
    updateSnackbar: (show, header, content, notificationType) => {
      dispatch ({
        type: 'NOTIFICATION_SNACKBAR_UPDATE',
        show,
        header,
        content,
        notificationType
      })
    },
    dispatch
  }
}

const mapStateToProps = (state) => ({
  formFields: state.forms.loginForm.fields,
  isValid:  state.forms.loginForm.valid
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginForm)