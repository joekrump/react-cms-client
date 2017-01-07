import { takeLatest, throttle } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import { getIndexItems, putResourceData } from '../../helpers/ResourceHelper';
import { updateSnackbar } from '../actions/notification';
import { updateTreeResourceAttributes } from '../actions/tree';

function* setResourceData(action) {
  try {
    yield put({type: 'UPDATE_ADMIN_LOAD_STATE', dataLoading: true});
    // set the resource data in the redux store.
    if(action.pageType === 'index') {
      const flatNodes = yield call(getIndexItems, action.namePlural, put);
      yield put({type: 'UPDATE_TREE', flatNodes})
      yield put({type: 'UPDATE_ADMIN_LOAD_STATE', dataLoading: false});
    }
  } catch (e) {
     yield console.log('exception in setResourceData: ', e)
  }
}

function* updateResource(action) {
  
  let result = yield call(putResourceData, put, `${action.pluralName}/${action.resourceId}`, {data: action.dataToUpdate});
  if (result === -1) {
    yield put(updateTreeResourceAttributes(
      action.pluralName,
      action.dataToUpdate,
      action.resourceId
    ));
    yield put(updateSnackbar(
      true,
      'Updated',
      'Update was successful!',
      'success'
    ));
  } else {
    yield put(updateSnackbar(
      true,
      'Error',
      `Update Failed Unexpectedly, please report this as a bug`,
      'error'
    ));
  }
} 

export default function* adminSaga() {
  yield [
    takeLatest('UPDATE_ADMIN_STATE', setResourceData),
    throttle(500, 'UPDATE_RESOURCE_DATA', updateResource)
  ]
}