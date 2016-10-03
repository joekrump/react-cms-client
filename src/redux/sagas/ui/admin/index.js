import { takeLatest } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import TreeHelper from '../../../helpers';

const getTree = (state) => state.tree.indexTree.nodeArray
  

function removeFromTree(item_id){
  let tree = yield select(getTree)
  let helper = new TreeHelper(tree, true);
  helper.removeFromTreeByItemId(item_id);
  return helper.richNodeArray;
}

/**
 * Uses react-redux-router to alter the path for a user when they logout
 * @param {object} action        - redux action
 * @yield {[type]} [description]
 */
function* updateTree(action) {
  try {
    // Clear session data
    let nodeArray = yield call(removeFromTree, action.item_id);
    yield put({action: "UPDATE_TREE", nodeArray });
  } catch (e) {
     yield console.log('exception in ui/admin/index saga', e)
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