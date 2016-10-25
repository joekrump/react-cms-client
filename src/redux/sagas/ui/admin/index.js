import { takeLatest } from 'redux-saga'
import { call, put, select } from 'redux-saga/effects'
import { deleteNode } from '../../../../helpers/TreeHelper';

const getTree = (state) => state.tree.indexTree.flatNodes
  
function* removeFromTree(item_id){
  let flatNodes = yield select(getTree)
  return yield call(removeItem, flatNodes, item_id)
}

function removeItem(flatNodes, item_id) {
  let updatedFlatNodes = deleteNode(flatNodes, item_id);
  return updatedFlatNodes;
}

/**
 * Uses react-redux-router to alter the path for a user when they logout
 * @param {object} action        - redux action
 * @yield {[type]} [description]
 */
function* updateTree(action) {
  try {
    // Clear session data
    let flatNodes = yield call(removeFromTree, action.item_id);
    yield put({type: "UPDATE_TREE", flatNodes });
  } catch (e) {
     yield console.log('exception in ui/admin/index saga', e)
  }
}

function* deleteItem() {
  yield * takeLatest("U_INDEX_ITEM_DELETED", updateTree)
}

export default function* indexSaga(){
  yield [
    deleteItem()
  ]
}