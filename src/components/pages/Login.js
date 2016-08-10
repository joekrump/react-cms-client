import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import auth from '../../auth';
import { connect } from 'react-redux';

const Login = React.createClass({    
  getInitialState(){
    return {
      email: '',
      password: '',
      error: false,
      loggedIn: auth.loggedIn()
    };
  },
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
      
      this.props.loginUser(authData.user, authData.token, redirectPath)
      
    })
  },
  updateAuth(loggedIn) {
    this.setState({
      loggedIn
    })
  },
  componentWillMount(){
    window.addEventListener(auth.onChange, this.updateAuth);
  },
  componentWillUnmount() {
    window.removeEventListener(auth.onChange, this.updateAuth);
  },
  handleChange(e){
    let oldState = this.state;
    oldState[e.target.name] = e.target.value;
    this.setState(oldState)
  },
  render() {
    return (
      <div className="login" onSubmit={this.handleSubmit}>
        <h1>Login</h1>
        <form>
          <TextField
            hintText="Email"
            floatingLabelText="Email"
            type="text"
            name="email"
            ref="loginEmail"
            onChange={this.handleChange}
            autoFocus
          /><br />
          <TextField
            hintText="Password"
            floatingLabelText="Password"
            type="password"
            name="password"
            ref="loginPassword"
            onChange={this.handleChange}
          /><br />
          <RaisedButton label="Login" primary onTouchTap={this.handleSubmit} type="submit" />
          {this.state.error && (
            <p>Bad login information</p>
          )}
        </form>
      </div>
    );
  }
});

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


const LoginRedux = connect(
  null,
  mapDispatchToProps
)(Login)

export default LoginRedux;