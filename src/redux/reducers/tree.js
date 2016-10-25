import TreeHelper from '../../helpers/TreeHelper';

const initialState = {
  indexTree: {
    flatNodes: [],
    minimalArray: [],
    lookupArray: []
  }
};

const treeReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_TREE':
      let helper = new TreeHelper(action.flatNodes);
      return {
        indexTree: {
          flatNodes: action.flatNodes,
          minimalArray: helper.minimalArray(),
          lookupArray: helper.lookupArray
        }
      }
    default:
      return state;
  }
}

export {treeReducer as tree}