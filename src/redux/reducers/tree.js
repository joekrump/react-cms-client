import TreeHelper from '../../helpers/TreeHelper'

const initialState = {
  indexTree: {
    nodeArray: []
  }
};

const treeReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_TREE':
      return {
        indexTree: {
          nodeArray: action.nodeArray
        }
      }
    default:
      return state;
  }
}

export {treeReducer as tree}