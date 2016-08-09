import request from 'superagent';
import AppConfig from '../app_config/app';

module.exports = {
  login(email, pass, handleLoggedInCallback) {

    // If there is a laravelAccessToken just log in
    if (sessionStorage.laravelAccessToken && sessionStorage.laravelUser) {
      this.handleLoggedIn(handleLoggedInCallback, {
        authenticated: true, 
        user: sessionStorage.laravelUser, 
        token: sessionStorage.laravelAccessToken
      });
      if(handleLoggedInCallback) {
        handleLoggedInCallback();
      }
      return
    }

    makeLoginRequest(email, pass, (res) => {
      if (res.authenticated) {
        this.handleLoggedIn(handleLoggedInCallback, res, true);
      } else {
        this.handleLoggedIn(handleLoggedInCallback, res); // no second param as it defaults to false
      }
    })
  },
  getUser() {
    return sessionStorage.laravelUser ? JSON.parse(sessionStorage.laravelUser) : null;
  },
  getToken() {
    return sessionStorage.laravelAccessToken
  },

  logout(logoutCallback) {

    this.onChange(false)

    postLogoutToServer(logoutCallback, this);
  },

  loggedIn() {
    return !!sessionStorage.laravelAccessToken && !((sessionStorage.laravelAccessToken === null) || (sessionStorage.laravelAccessToken === undefined))
  },
  /**
   * When the status of a user changes (logged in or not) perform some additional logic
   * @param  {Boolean} isLoggedIn - whether the current client is logge in or not. Default: false
   * @return {undefined}
   */
  onChange(isLoggedIn) {},
  /**
   * handle the logging in of a user.
   * @param  {function}  handleLoggedInCallback Callback function passed in that handles the logging in logic
   * @param  {Boolean} isLoggedIn             Whether the user is logged in or not. Defaults to false
   * @return {undefined}                      
   */
  handleLoggedIn(handleLoggedInCallback, data, isLoggedIn = false){
    // If there is a callback method for handling login then
    // run it with the loggedIn value set to true
    //
    //
    this.onChange(isLoggedIn)

    if (handleLoggedInCallback) {
      handleLoggedInCallback(data, isLoggedIn)
    }
    
    return;
  }
}

function parseSessionData(res){
  return JSON.parse(res.text);
}

function postLogoutToServer(callback, component) {
  request.post(AppConfig.apiBaseUrl +'auth/logout')
    .set('Authorization', 'Bearer ' + sessionStorage.laravelAccessToken)
    .set('Accept', 'application/json')
    .end(function(err, res){

      if(err !== null) {
        if(res.statusCode === 401) {
          if (callback) {
            callback()
          } 
        } else {
          // if user didn't successfully logout then show that they are still logged in after optimistic change.
          component.onChange(true) 
        }
      } else if (res.statusCode !== 200) {
        // if user didn't successfully logout then show that they are still logged in after optimistic change.
        component.onChange(true) 
      } else {
        // if all goes well, and there is a callback, call it.
        if (callback) {
          callback()
        } 
      }
    });
}
function makeLoginRequest(email, password, loginRequestCallback) {
  request.post(AppConfig.apiBaseUrl +'auth/login')
    .set('Accept', 'application/json')
    .send({email, password})
    .end(function(err, res){

      if(err !== null) {
        // Something unexpected happened
        loginRequestCallback({ authenticated: false, token: null, user: null });
        console.warn(err);
      } else if (res.statusCode !== 200) {
        loginRequestCallback({ authenticated: false, token: null, user: null });
        console.log(res);
      } else {
        // Store session token in browser sessionStorage.
        loginRequestCallback({ 
          authenticated: true, 
          token: parseSessionData(res).token,
          user: parseSessionData(res).user
        });
      }
    });
}

