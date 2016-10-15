import { takeLatest } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import { push } from 'react-router-redux'

function setSessionStorage(token, user){
  console.log('SET SESSION STORAGE')
  if(typeof sessionStorage !== 'undefined'){
    if(token) {
      sessionStorage.laravelAccessToken = token;
    }
    if(user) {

      sessionStorage.laravelUser = JSON.stringify(user);
    }
  }
}

function* redirectUserAfterLogin(action) {
  console.log('redirectUserAfterLogin');
   try {
      yield call(setSessionStorage, action.token, action.user);
      if(action.redirectPath !== undefined) {
        yield put(push(action.redirectPath));
      }
   } catch (e) {
      yield console.log('exception in loginSaga, redirect after login ', e)
   }
}

export default function* loginSaga() {
  yield * takeLatest("USER_LOGGED_IN", redirectUserAfterLogin)
}