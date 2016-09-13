import { takeLatest, takeEvery } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import { push } from 'react-router-redux'

function* redirectUserAfterLogin(action) {
   try {
      yield call(setSessionStorage, action.token, action.user);
      if(action.redirectPath !== undefined) {
        yield put(push(action.redirectPath));
      }
   } catch (e) {
      yield console.log('exception in loginSaga, redirect after login ', e)
   }
}

function* redirectUserAfterLogout(action) {
  try {
    // Clear session data
    yield call(clearSessionStorage);
    yield put(push(action.redirectPath));
  } catch (e) {
     yield console.log('exception in logoutSaga, redirect after logout', e)
  }
}

function* updateTokenOnUpdate(action) {
  try {
    // Clear session data
    yield call(setSessionStorage, action.token, null);
  } catch (e) {
     yield console.log('exception in tokenUpdatedSaga, update token', e)
  }
}

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

function clearSessionStorage(){
  if(typeof sessionStorage !== 'undefined'){
    sessionStorage.removeItem('laravelAccessToken')
    sessionStorage.removeItem('laravelUser')
  }
}

    
// redirectPath = this.props.redirectAfterLogin(push(location.state.nextPathname))
// redirectPath = this.props.redirectAfterLogin(push('/admin'))

// Generator for the admin saga
function* loginSaga() {
  yield * takeLatest("USER_LOGGED_IN", redirectUserAfterLogin)
}

function* logoutSaga() {
  yield * takeLatest("USER_LOGGED_OUT", redirectUserAfterLogout)
}

function* tokenUpdatedSaga() {
  yield * takeEvery("TOKEN_UPDATED", updateTokenOnUpdate)
}

export default function* rootSaga(){
  yield [
    loginSaga(),
    logoutSaga(),
    tokenUpdatedSaga()
  ]
}