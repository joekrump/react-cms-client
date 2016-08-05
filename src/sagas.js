import { takeEvery, takeLatest } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import { push } from 'react-router-redux'

function* redirectUserAfterLogin(action) {
   try {
      yield setSessionStorage(action.token, action.user);
      yield put(push(action.redirectPath));
   } catch (e) {
      yield console.log('exception in admin saga ', e)
   }
}

function setSessionStorage(token, user){
  sessionStorage.laravelAccessToken = token;
  sessionStorage.laravelUser = JSON.stringify(user);
}

// redirectPath = this.props.redirectAfterLogin(push(location.state.nextPathname))
// redirectPath = this.props.redirectAfterLogin(push('/admin'))

// Generator for the admin saga
function* adminSaga() {
  yield* takeEvery("USER_LOGGED_IN", redirectUserAfterLogin);
}

export default function* rootSaga(){
  yield [
    adminSaga()
  ]
}