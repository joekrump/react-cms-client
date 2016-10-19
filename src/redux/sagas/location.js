import { takeLatest } from 'redux-saga'
import { put } from 'redux-saga/effects'
import { loggedIn } from '../../auth';

function* updateAdminState(action) {
  try {
    if(loggedIn()) {
      yield put({type: 'UPDATE_INDEX_HAS_CHANGES', hasChanges: false});
    }
  } catch (e) {
     yield console.log('exception in updateResourceData: ', e)
  }
}

export default function* locationSaga() {
  yield takeLatest('@@routes/LOCATION_CHANGE', updateAdminState)
}