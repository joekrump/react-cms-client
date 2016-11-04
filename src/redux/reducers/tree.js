import { makeMinimalArray } from '../../helpers/TreeHelper';
import initialState from '../store/initial_states/tree';

const treeReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_TREE':
      return {
        indexTree: {
          flatNodes: action.flatNodes,
          minimalArray: makeMinimalArray(action.flatNodes[0].children)
        }
      }
    default:
      return state;
  }
}

export {treeReducer as tree}