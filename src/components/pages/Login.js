import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import auth from '../../auth';

import { withRouter } from 'react-router'

const Login = withRouter(

  React.createClass({
    
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
      auth.login(this.state.email, this.state.password, (loggedIn) => {
        if(!loggedIn)
          return this.setState({error: true})

        const { location } = this.props

        // If the user tried to access a specific admin route before logging in then redirect them there after login
        // otherwise default to /admin
        // 
        if(location.state && location.state.nextPathname) {
          this.props.router.push(location.state.nextPathname)
        } else {
          this.props.router.push('/admin')
        }
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
      return (<div className="login" onSubmit={this.handleSubmit}>
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
      </div>);
    }
  })
);

export default Login;