import React from 'react';
import auth from '../auth';
import { connect } from 'react-redux';
import AdminNav from './Nav/AdminNav';
import TopNav from './Nav/SiteTopNav';
import Page from './Pages/Page/Page';
import AccessDeniedPage from './Pages/Errors/401/401';

class App extends React.Component {

  componentWillMount() {
    let hasUserAndToken = auth.getToken() && auth.getUser();
    
    if(!this.props.loggedIn && hasUserAndToken){
      auth.login(null, null, this.props.loginUser, this.props.dispatch)
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.pageStatus !== this.props.pageStatus) {
      return true;
    } else if (nextProps.location !== this.props.location) {
      return true;
    } else if (nextProps.loggedIn !== this.props.loggedIn) { 
      return true;
    } else {
      return false
    }
  }
  renderContent() {
    if(this.props.loggedIn) {
      if(this.props.pageStatus === 401) {
        return (<AccessDeniedPage />);
      } else {
        return this.props.children;
      }
    } else {
      return (<Page location={this.props.location} />)
    }
  }
  render = _ => {
    console.log("logged in: ", this.props.loggedIn)

    return (
      <div id="app">
        {this.props.loggedIn ? <AdminNav /> : <TopNav />}
        {this.renderContent()}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  loggedIn: state.auth.logged_in,
  pageStatus: state.page.statusCode
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
