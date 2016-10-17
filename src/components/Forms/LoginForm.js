import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import auth from '../../auth';
import { connect } from 'react-redux';
import ForgotPasswordLink from '../Pages/Auth/ForgotPassword/ForgotPasswordLink';

class LoginForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: false,
      loggedIn: auth.loggedIn(),
      disabled: props.disabled
    };
  }

  loginCallback(authData, loggedIn) {
    if(!loggedIn)
      return this.setState({error: true})

    const { location } = this.props
    let redirectPath;
    this.setState({error: false});
    
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
      null, 
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
          <RaisedButton label="Login" primary onTouchTap={(event) => this.handleSubmit(event)} type="submit" disabled={this.state.disabled} />
          {this.state.error && (
            <p>Bad login information</p>
          )}
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
    dispatch
  }
}

const LoginRedux = connect(
  null,
  mapDispatchToProps
)(LoginForm)

export default LoginRedux;