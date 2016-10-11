import { takeLatest } from 'redux-saga'
import { call, put, select } from 'redux-saga/effects'

const getForm = (state, formName) => state.forms[formName]

/**
 * When an input field is updated, check to see if the form is valid now
 * @param {Object} action        - The redux action that was taken by a saga to react to.
 * @yield {redux-saga/effect}
 */
function* checkFormIsValidOnUpdate(action) {
  let form = yield select(getForm, action.formName)
  // If the form was previously invalid, check to see if it is now valid.

  let isValid = yield call(checkFormIsValid, form);
  yield put({type: 'FORM_VALID', formName: action.formName, valid: isValid})
}

/**
 * Based on whether the fields for a form have errors or not, set the form as valid or not.
 * @param  {Object} form - The state of the form which validation is to be checked on
 * @return {boolean}     - returns whether or not the form is valid.
 */
function checkFormIsValid(form) {
  let isValid = false;
  let fieldNames = Object.keys(form.fields)

  for(let i = 0; i < fieldNames.length; i++){
    if(form.fields[fieldNames[i]].errors.length > 0) {
      isValid = false;
      break;
    } else {
      isValid = true;
    }
  }
  return isValid;
}

export default function* fieldUpdateSage() {
  yield * takeLatest("FORM_INPUT_CHANGE", checkFormIsValidOnUpdate)
}
