import TreeHelper from '../../helpers/TreeHelper';

const initialState = {
  indexTree: {
    nodeArray: [],
    minimalArray: []
  }
};

const treeReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_TREE':
      return {
        indexTree: {
          nodeArray: action.nodeArray,
          minimalArray: (new TreeHelper(action.nodeArray, true)).minimalArray()
        }
      }
    default:
      return state;
  }
}

export {treeReducer as tree}