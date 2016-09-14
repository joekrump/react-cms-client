import APIClient from './http/requests'


module.exports = {
  login(email, pass, handleLoggedInCallback, store) {

    // If there is a laravelAccessToken just log in
    if ((typeof sessionStorage !== 'undefined') && sessionStorage.laravelAccessToken && sessionStorage.laravelUser) {
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
    }, store)
  },
  getUser() {
    if(typeof sessionStorage !== 'undefined') {
      return sessionStorage.laravelUser ? JSON.parse(sessionStorage.laravelUser) : null;
    } else {
      return null;
    }
  },
  getToken() {
    if(typeof sessionStorage !== 'undefined') {
      return sessionStorage.laravelAccessToken
    } else {
      return null;
    }
  },

  logout(logoutCallback, store) {

    this.onChange(false)

    logoutFromServer(logoutCallback, this, store);
  },

  loggedIn() {
    if(typeof sessionStorage !== 'undefined'){
      return !!sessionStorage.laravelAccessToken && !((sessionStorage.laravelAccessToken === null) || (sessionStorage.laravelAccessToken === undefined))
    } else {
      return false;
    }
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
    this.onChange(isLoggedIn)

    if (handleLoggedInCallback) {
      handleLoggedInCallback(data, isLoggedIn)
    }
    
    return;
  }
}

function logoutFromServer(callback, component, store) {
  let client = new APIClient(store);

  client.post('auth/logout').then((res) => {
    if (res.statusCode !== 200) {
      // if user didn't successfully logout then show that they are still logged in after optimistic change.
      component.onChange(true) 
    } else {
      // if all goes well, and there is a callback, call it.
      if (callback) {
        callback()
      } 
    }
  }).catch((res) => {
    if(res.statusCode === 401) {
      if (callback) {
        callback()
      } 
    } else {
      // if user didn't successfully logout then show that they are still logged in after optimistic change.
      component.onChange(true) 
    }
  })
}

function makeLoginRequest(email, password, loginRequestCallback, store) {
  let client = new APIClient(store);

  client.post('auth/login', false, {data: { email, password }}).then((res) => {
    if (res.statusCode !== 200) {
      handleLoginFailure(loginRequestCallback)
    } else {
      handleLoginSuccess(loginRequestCallback, res);
    }
  }).catch((res) => {
    handleLoginFailure(loginRequestCallback)
  })
}

function handleLoginSuccess(loginRequestCallback, res) {
  loginRequestCallback({ 
    authenticated: true, 
    token: res.body.token,
    user: res.body.user
  })
}

function handleLoginFailure(loginRequestCallback) {
  loginRequestCallback({ 
    authenticated: false, 
    token: null, 
    user: null 
  })
}
