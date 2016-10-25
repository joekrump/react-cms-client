import TreeHelper from '../../helpers/TreeHelper';

const initialState = {
  indexTree: {
    flatNodes: [],
    minimalArray: [],
  }
};

const treeReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_TREE':
      return {
        indexTree: {
          flatNodes: action.flatNodes,
          minimalArray: (new TreeHelper(action.flatNodes)).minimalArray(),
        }
      }
    default:
      return state;
  }
}

export {treeReducer as tree}