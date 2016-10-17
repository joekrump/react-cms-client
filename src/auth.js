import APIClient from './http/requests'

module.exports = {

  /**
   * Method to log user into admin
   * @param  {string} email                    - email address of the user that is trying to log in
   * @param  {string} pass                     - the password for the user that is trying to log in
   * @param  {fucntion} handleLoggedInCallback - function to call on user logged in
   * @param  {string} token                    - JWT used for communication with the app
   * @param  {function} dispatch               - redux dispatch method
   * @return {undefined}                     
   */
  login(email, pass, handleLoggedInCallback, token, dispatch) {
    // If there is a laravelAccessToken just log in
    if ((typeof sessionStorage !== 'undefined') && sessionStorage.laravelAccessToken && sessionStorage.laravelUser) {
      this.handleLoggedIn(handleLoggedInCallback, this.parsedUser(), sessionStorage.laravelAccessToken, true);
    } else {
      makeLoginRequest(email, pass, (res) => loginRequestCB(res, handleLoggedIn, handleLoggedInCallback), token, dispatch)
    }
  },
  getUser() {
    if(typeof sessionStorage !== 'undefined') {
      return sessionStorage.laravelUser ? this.parsedUser() : null;
    } else {
      return null;
    }
  },
  parsedUser() {
    return JSON.parse(sessionStorage.laravelUser);
  },
  logout(logoutCallback, logoutFailedCB, dispatch) {
    logoutFromServer(logoutCallback, logoutFailedCB, this, getToken(), dispatch);
  },

  getToken: getToken,
  loggedIn: loggedIn,
  handleLoggedIn: handleLoggedIn
}

function loggedIn() {
  if(typeof sessionStorage !== 'undefined'){
    return !!sessionStorage.laravelAccessToken && !((sessionStorage.laravelAccessToken === null) || (sessionStorage.laravelAccessToken === undefined))
  } else {
    return false;
  }
}

function getToken() {
  if(typeof sessionStorage !== 'undefined') {
    return sessionStorage.laravelAccessToken
  } else {
    return null;
  }
}

function loginRequestCB(res, handleLoggedIn, cb) {
  if (res.authenticated) {
    handleLoggedIn(cb, res, true);
  } else {
    handleLoggedIn(cb, res); // no second param as it defaults to false
  }
}

 /**
 * handle the logging in of a user.
 * @param  {function} onLoggedInCB - Callback function passed in that handles the logging in logic
 * @param  {Boolean}  isLoggedIn   - Whether the user is logged in or not. Defaults to false
 * @return {undefined}                      
 */
function handleLoggedIn(onLoggedInCB, user, token, isLoggedIn = false){
  if (onLoggedInCB) {
    onLoggedInCB(user, token, isLoggedIn)
  }
  return;
}

function logoutFromServer(onSuccessCB, onFailureCB, component, token, dispatch) {
  let client = new APIClient(token, dispatch);

  client.post('auth/logout').then((res) => {
    if (!((res.statusCode === 200) || (res.statusCode === 204))) {
      // if user didn't successfully logout then show that they are still logged in after optimistic change.
      onFailureCB();
    } else {
      // if all goes well, and there is a callback, call it.
      onSuccessCB()
    }
  }).catch((res) => {
    if(res.statusCode === 401) {
      onSuccessCB()
    } else {
      // if user didn't successfully logout then show that they are still logged in after optimistic change.
      onFailureCB();
    }
  })
}

function makeLoginRequest(email, password, loginRequestCallback, token, dispatch) {
  let client = new APIClient(token, dispatch);

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
