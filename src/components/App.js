import React from 'react';
import auth from '../auth';
import { connect } from 'react-redux';
import AdminNav from './Nav/AdminNav';
import TopNav from './Nav/SiteTopNav';
import Page from './Pages/Page/Page';

class App extends React.Component {

  componentWillMount() {
    if((typeof sessionStorage !== 'undefined') && sessionStorage.laravelAccessToken){
      auth.login(null, null, this.props.loginUser, this.props.dispatch)
    }
  }

  render = _ => (
    <div id="app">
      {this.props.loggedIn ? <AdminNav /> : <TopNav />}
      {this.props.loggedIn ? this.props.children : <Page location={this.props.location} />}
    </div>
  )
}

const mapStateToProps = (state) => ({
  loggedIn: state.auth.logged_in
});

const mapDispatchToProps = (dispatch) => ({
  loginUser: (user, token, loggedIn, redirectPath) => {
    dispatch({
      type: 'USER_LOGGED_IN',
      user,
      token,
      loggedIn,
      redirectPath
    })
  },
  dispatch
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
