import { takeLatest } from 'redux-saga'
import { call } from 'redux-saga/effects'

function setSessionStorage(token, user){
  if(typeof sessionStorage !== 'undefined'){
    if(token) {
      sessionStorage.laravelAccessToken = token;
    }
    if(user) {
      sessionStorage.laravelUser = JSON.stringify(user);
    }
  }
}

/**
 * Functions to run in response to a TOKEN_UPDATE action
 * @param {Object} action        - The TOKEN_UPDATE action that was taken.
 * @yield {Function}
 */
function* updateTokenOnUpdate(action) {
  try {
    // Clear session data
    yield call(setSessionStorage, action.token, null);
  } catch (e) {
     yield console.log('exception in tokenUpdatedSaga, update token', e)
  }
}

export default function* tokenUpdatedSaga() {
  yield * takeLatest("TOKEN_UPDATED", updateTokenOnUpdate)
}