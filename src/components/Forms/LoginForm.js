import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import auth from '../../auth';
import { connect } from 'react-redux';
import ForgotPasswordLink from '../Pages/Auth/ForgotPassword/ForgotPasswordLink';
import NotificationSnackbar from '../Notifications/Snackbar/Snackbar'

class LoginForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      loggedIn: auth.loggedIn(),
      disabled: props.disabled
    };
  }

  loginCallback(authData, loggedIn) {
    if(!loggedIn)
      this.props.updateSnackbar(true, 'Error', 'Email and password combination not found', 'warning');
      return

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
      this.state.email, 
      this.state.password, 
      (authData, loggedIn) => this.loginCallback(authData, loggedIn),
      this.props.dispatch
    )
  }

  handleChange(e){
    let oldState = this.state;
    oldState[e.target.name] = e.target.value;
    this.setState(oldState)
  }
  render() {
    return (
      <div className="login-form-container" onSubmit={(event) => this.handleSubmit(event)}>
        <form className="login-form">
          <TextField
            hintText="Email"
            floatingLabelText="Email"
            type="text"
            name="email"
            ref="loginEmail"
            onChange={(event) => this.handleChange(event)}
            autoFocus
          /><br />
          <TextField
            hintText="Password"
            floatingLabelText="Password"
            type="password"
            name="password"
            ref="loginPassword"
            onChange={(event) => this.handleChange(event)}
          /><br />
          <RaisedButton label="Login" primary type="submit" disabled={this.state.disabled} />
        
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

const LoginRedux = connect(
  null,
  mapDispatchToProps
)(LoginForm)

export default LoginRedux;