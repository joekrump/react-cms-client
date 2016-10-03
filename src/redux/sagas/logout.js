import { takeLatest } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import { push } from 'react-router-redux'

function clearSessionStorage(){
  if(typeof sessionStorage !== 'undefined'){
    sessionStorage.removeItem('laravelAccessToken')
    sessionStorage.removeItem('laravelUser')
  }
}

/**
 * Uses react-redux-router to alter the path for a user when they logout
 * @param {object} action        - redux action
 * @yield {[type]} [description]
 */
function* redirectUserAfterLogout(action) {
  try {
    // Clear session data
    yield call(clearSessionStorage);
    yield put(push(action.redirectPath));
  } catch (e) {
     yield console.log('exception in logoutSaga, redirect after logout', e)
  }
}

export default function* logoutSaga() {
  yield * takeLatest("USER_LOGGED_OUT", redirectUserAfterLogout)
}

