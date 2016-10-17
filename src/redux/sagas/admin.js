import { takeLatest } from 'redux-saga'
import { call, put } from 'redux-saga/effects'

function setResourceData(resourceNamePlural, resourceId, pageType){
  // set the resource data in the redux store.
  if(pageType === 'index') {
    setIndexItems(resourceNamePlural, put);
  }
}

/**
 * Functions to run in response to a TOKEN_UPDATE action
 * @param {Object} action        - The TOKEN_UPDATE action that was taken.
 * @yield {Function}
 */
function* updateResourceData(action) {
  try {
    // Clear session data
    yield call(setResourceData, action.namePlural, action.resourceId, action.pageType);
  } catch (e) {
     yield console.log('exception in updateResourceData: ', e)
  }
}

export default function* adminSaga() {
  yield * takeLatest('UPDATE_ADMIN_STATE', updateResourceData)
}