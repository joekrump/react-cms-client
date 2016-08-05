import { takeEvery, takeLatest } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import { push } from 'react-router-redux'

function* redirectUserAfterLogin(action) {
   try {
      yield call(setSessionStorage, action.token, action.user);
      yield put(push(action.redirectPath));
   } catch (e) {
      yield console.log('exception in admin saga, redirect after login ', e)
   }
}

function* redirectUserAfterLogout(action) {
  try {
    // Clear session data
    yield call(clearSessionStorage);
    yield put(push(action.redirectPath));
  } catch (e) {
     yield console.log('exception in admin saga, redirect after logout', e)
  }
}

function setSessionStorage(token, user){
  sessionStorage.laravelAccessToken = token;
  sessionStorage.laravelUser = JSON.stringify(user);
}

function clearSessionStorage(){
  delete sessionStorage.laravelAccessToken
  delete sessionStorage.laravelUser
}

// redirectPath = this.props.redirectAfterLogin(push(location.state.nextPathname))
// redirectPath = this.props.redirectAfterLogin(push('/admin'))

// Generator for the admin saga
function* adminSaga() {
  yield* takeEvery("USER_LOGGED_IN", redirectUserAfterLogin);
  yield* takeLatest("USER_LOGGED_OUT", redirectUserAfterLogout);
}

export default function* rootSaga(){
  yield [
    adminSaga()
  ]
}