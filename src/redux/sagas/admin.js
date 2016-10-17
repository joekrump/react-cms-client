import { takeLatest } from 'redux-saga'
import { call } from 'redux-saga/effects'
import { setIndexItems } from '../../helpers/ResourceHelper';

function setResourceData(resourceNamePlural, resourceId, pageType){
  // set the resource data in the redux store.
  if(pageType === 'index') {
    console.log('index Page')
    setIndexItems(resourceNamePlural);
  }
}

/**
 * Functions to run in response to a TOKEN_UPDATE action
 * @param {Object} action        - The TOKEN_UPDATE action that was taken.
 * @yield {Function}
 */
function* updateResourceData(action) {
  console.log('admin saga')
  try {
    // Clear session data
    yield call(setResourceData, action.resourceNamePlural, action.resourceId, action.pageType);
  } catch (e) {
     yield console.log('exception in updateResourceData: ', e)
  }
}

export default function* adminSaga() {
  yield * takeLatest('UPDATE_ADMIN_STATE', updateResourceData)
}