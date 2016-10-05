import React from 'react';
import auth from '../auth';
import { connect } from 'react-redux';
import AdminNav from './Nav/AdminNav';

class App extends React.Component {

  updateAuth(loggedIn) {
    if(!loggedIn && auth.getUser() && auth.getToken()) {
      this.props.loginUser(auth.getUser(), (typeof sessionStorage !== 'undefined' ? sessionStorage.laravelAccessToken : null));      
    }
  }

  componentDidMount() {
    // Do something when the app first mounts
  }
  componentWillMount() {
    auth.onChange = () => this.updateAuth(this.props.loggedIn)
    if((typeof sessionStorage !== 'undefined') && sessionStorage.laravelAccessToken){
      auth.login(null, null, null, this.context.store)
    }
  }

  render() {
    return (
      <div id="app">
        {this.props.loggedIn ? <AdminNav /> : null}
        {this.props.children}
      </div>
    )
  }
}

App.contextTypes = {
  store: React.PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.auth.logged_in,
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
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
