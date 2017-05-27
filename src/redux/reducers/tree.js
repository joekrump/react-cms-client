import { makeMinimalArray } from '../../helpers/TreeHelper';
import initialState from '../store/initial_states/tree';
import merge from 'lodash.merge';

const treeReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_TREE':
      return {
        indexTree: {
          flatNodes: action.flatNodes,
          minimalArray: makeMinimalArray(action.flatNodes[0].children)
        }
      }

    case 'UPDATE_TREE_STATE':
      return merge({}, state.indexTree, action.updatedTree);
    case 'UPDATE_RESOURCE_ATTRIBUTES_IN_TREE':
      return updateSingleNodeInTree(state, action);
    default:
      return state;
  }
}

function updateSingleNodeInTree(previousState, action) {
  let nodeIndex = -1;
  previousState.indexTree.flatNodes.some((node, i) => {
    if(node.id == action.resourceId) {
      nodeIndex = i;
      return true;
    }
  });
  
  if(nodeIndex === -1) {
    return previousState;
  } else {
    
    let childNode = previousState.indexTree.flatNodes[nodeIndex];
    let parentIndex = 0;
    let nodeIndexInParentsChildren = 0;
    let flatNodes = previousState.indexTree.flatNodes;

    previousState.indexTree.flatNodes.some((node, i) => {
      if(node.id === childNode.parent_id) {
        parentIndex = i;
        return true;
      }
    });

    let parentNode = previousState.indexTree.flatNodes[parentIndex];
    nodeIndexInParentsChildren = parentNode.children.indexOf(childNode);
    
    if(nodeIndexInParentsChildren === -1) {
      nodeIndexInParentsChildren = 0;
    }

    // update some of the node's values 
    childNode = merge({}, childNode, action.dataToUpdate);
    // update the node in its parent. 
    parentNode.children[nodeIndexInParentsChildren] = childNode;
    
    // override the previous values from flatNodes
    flatNodes[nodeIndex] = childNode;
    flatNodes[parentIndex] = parentNode;
    
    return merge({}, previousState, {
      indexTree: merge({}, previousState.indexTree, {
        flatNodes
      })
    });
  }
}

export {treeReducer as tree}
