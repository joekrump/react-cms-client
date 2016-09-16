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

  handleSubmit(e){
    e.preventDefault()
    auth.login(this.state.email, this.state.password, (authData, loggedIn) => {
      if(!loggedIn)
        return this.setState({error: true})

      const { location } = this.props
      var redirectPath;

      this.setState({error: false});
      
      // If the user tried to access a specific admin route before logging in then redirect them there after login
      // otherwise default to /admin
      // 
      if(location.state && location.state.nextPathname) {
        redirectPath = location.state.nextPathname
      } else {
        redirectPath = '/admin'
      }
      
      this.props.loginUser(authData.user, authData.token, redirectPath);
      
    }, this.context.store)
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
    loginUser: (user, token, redirectPath) => {
      dispatch ({
        type: 'USER_LOGGED_IN',
        user,
        token,
        redirectPath
      })
    },
    redirectAfterLogin: (callback) => {
      dispatch(callback)
    }
  }
}

LoginForm.contextTypes = {
  store: React.PropTypes.object
}

const LoginRedux = connect(
  null,
  mapDispatchToProps
)(LoginForm)

export default LoginRedux;