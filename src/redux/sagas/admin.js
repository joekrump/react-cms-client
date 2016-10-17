import { takeLatest } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import { getIndexItems } from '../../helpers/ResourceHelper';

function* setResourceData(action) {
  try {
    yield put({type: 'UPDATE_ADMIN_LOAD_STATE', dataLoading: true});
    // set the resource data in the redux store.
    if(action.pageType === 'index') {
      const nodeArray = yield call(getIndexItems, action.namePlural, put);
      yield put({type: 'UPDATE_TREE', nodeArray})
      yield put({type: 'UPDATE_ADMIN_LOAD_STATE', dataLoading: false});
    }
  } catch (e) {
     yield console.log('exception in updateResourceData: ', e)
  }
}

export default function* adminSaga() {
  yield takeLatest('UPDATE_ADMIN_STATE', setResourceData)
}