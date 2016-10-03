import { takeLatest } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import TreeHelper from '../../../helpers';

function removeFromTree(){

}

/**
 * Uses react-redux-router to alter the path for a user when they logout
 * @param {object} action        - redux action
 * @yield {[type]} [description]
 */
function* updateTree(action) {
  try {
    // Clear session data
    yield call(clearSessionStorage);
    yield put({

    });
  } catch (e) {
     yield console.log('exception in logoutSaga, redirect after logout', e)
  }
}

export default function* deleteItem() {
  yield * takeLatest("U_INDEX_ITEM_DELETED", updateTree)
}

export default function* indexSaga(){
  yield [
    deleteItem()
  ]
}