import { takeLatest, takeEvery } from 'redux-saga'
import { call, put, select } from 'redux-saga/effects'
import { push } from 'react-router-redux'

const getForm = (state, formName) => state.forms[formName]

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

/**
 * Uses react-redux-router to alter the path for a user when they logout
 * @param {[type]} action        [description]
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

/**
 * When an input field is updated, check to see if the form is valid now
 * @param {Object} action        - The redux action that was taken by a saga to react to.
 * @yield {redux-saga/effect}
 */
function* checkFormIsValidOnUpdate(action) {
  let form = yield select(getForm, action.formName)
  // If the form was previously invalid, check to see if it is now valid.
  if(!form.valid) {
    let isValid = yield call(checkFormIsValid, form);
    yield put({type: 'FORM_VALID', formName: action.formName, valid: isValid})
  }
}

/**
 * Based on whether the fields for a form have errors or not, set the form as valid or not.
 * @param  {Object} form - The state of the form which validation is to be checked on
 * @return {boolean}     - returns whether or not the form is valid.
 */
function checkFormIsValid(form) {
  let isValid = false;
  Object.keys(form.fields).some((fieldName) => {

    if(form.fields[fieldName].errors.length > 0) {
      isValid = false;
      return true;
    } else {
      isValid = true;
    }
  });

  return isValid;
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

function* fieldUpdateSage() {
  yield * takeLatest("FORM_INPUT_CHANGE", checkFormIsValidOnUpdate)
}

export default function* rootSaga(){
  yield [
    loginSaga(),
    logoutSaga(),
    tokenUpdatedSaga(),
    fieldUpdateSage()
  ]
}