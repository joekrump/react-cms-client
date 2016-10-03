import { takeLatest } from 'redux-saga'
import { call, put, select } from 'redux-saga/effects'
import TreeModifier from '../../../../helpers/TreeModifier';

const getTree = (state) => state.tree.indexTree.nodeArray
  
function* removeFromTree(item_id){
  let tree = yield select(getTree)
  return yield call(removeItem, tree, item_id)
}

function removeItem(tree, item_id) {
  let helper = new TreeModifier(tree);
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
    yield put({type: "UPDATE_TREE", nodeArray });
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