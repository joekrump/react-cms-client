import request from 'superagent';
import AppConfig from '../config/app';

module.exports = {
  login(email, pass, handleLoggedInCallback) {

    // If there is a laravelAccessToken just log in
    if (sessionStorage.laravelAccessToken) {
      this.handleLoggedIn(handleLoggedInCallback, true);
      return
    }

    makeLoginRequest(email, pass, (res) => {
      if (res.authenticated) {
        sessionStorage.laravelAccessToken = res.token;
        sessionStorage.laravelUser = JSON.stringify(res.user);
        this.handleLoggedIn(handleLoggedInCallback, true);
      } else {
        this.handleLoggedIn(handleLoggedInCallback); // no second param as it defaults to false
      }
    })
  },
  getUser() {
    if(!sessionStorage.laravelUser){
      return sessionStorage.laravelUser;
    }
    return JSON.parse(sessionStorage.laravelUser);
  },
  getToken() {
    return sessionStorage.laravelAccessToken
  },

  logout(logoutCallback) {
    delete sessionStorage.laravelAccessToken
    delete sessionStorage.laravelUser
    // if there is a callback, call it.
    if (logoutCallback) {
      logoutCallback()
    }
    this.onChange(false)
  },

  loggedIn() {
    return !!sessionStorage.laravelAccessToken
  },
  /**
   * When the status of a user changes (logged in or not) perform some additional logic
   * @param  {Boolean} isLoggedIn - whether the current client is logge in or not. Default: false
   * @return {undefined}
   */
  onChange(isLoggedIn = false) {

  },
  /**
   * handle the logging in of a user.
   * @param  {function}  handleLoggedInCallback Callback function passed in that handles the logging in logic
   * @param  {Boolean} isLoggedIn             Whether the user is logged in or not. Defaults to false
   * @return {undefined}                      
   */
  handleLoggedIn(handleLoggedInCallback, isLoggedIn = false){
    // If there is a callback method for handling login then
    // run it with the loggedIn value set to true
    //
    if (handleLoggedInCallback) {
      handleLoggedInCallback(isLoggedIn)
    }
    this.onChange(isLoggedIn)
    return;
  }
}

function parseSessionData(res){
  return JSON.parse(res.text);
}

function makeLoginRequest(email, password, loginRequestCallback) {
  // TODO: put URL strings (or parts of them in a NODE environment config file of some sort.)
  // @date: July 23, 2016
  //
  request.post(AppConfig.apiBaseUrl +'auth/login')
    .set('Access-Control-Allow-Origin', AppConfig.baseUrl)
    .set('Accept', 'application/json')
    .send({email, password})
    .end(function(err, res){

      loginRequestCallback({ authenticated: false });

      if(err !== null) {
        // Something unexpected happened
        console.warn(err);
      } else if (res.statusCode !== 200) {
        console.log(res);
      } else {
        // Store session token in browser sessionStorage.
        loginRequestCallback({ 
          authenticated: true, 
          token: parseSessionData(res).token,
          user: parseSessionData(res).user
        });
        
        // console.log(window.sessionStorage.laravelAccessToken);
        // make example request
        // 
        // request.get('http://laravel-api:1337/api/protected')
        //   .set('Access-Control-Allow-Origin', 'http://localhost:3000')
        //   .set('Accept', 'application/json')
        //   .set('Authorization', 'Bearer ' + window.sessionStorage.laravelAccessToken)
        //   .end(function(err, res) {
        //     console.log('res', res)
        //   })
      }
      
    });
}

