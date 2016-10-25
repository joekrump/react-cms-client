import find from 'lodash.find';

export default class TreeHelper {
  constructor(treeData) {

    this.addNodes = this.addNodes.bind(this);
    this.setChildIds = this.setChildIds.bind(this);
    this.moveNode = this.moveNode.bind(this);
    this.moveNode = this.moveNode.bind(this);
    this.addNodeToNewLocation = this.addNodeToNewLocation.bind(this);
    this.addToParentNodeChildren = this.addToParentNodeChildren.bind(this);
    this.updateSecondaryText = this.updateSecondaryText.bind(this);
    this.updateTree = this.updateTree.bind(this);
    this.contains = this._contains;

    const rootNode = {id: -1, children: treeData, child_ids: this.setChildIds(treeData)};

    this.flatNodes = [rootNode]

    this.addNodes(treeData);
  }

  /**
   * Build an array that contains the model ids of the nodes in the tree.
   * @param  {Array} treeData - A nested array of nodes. 
   * @return undefined
   */
  addNodes(treeData) {
    treeData.forEach((node) => {
      this.flatNodes.push(node);
      if(node.children && (node.children.length > 0)) {
        this.addNodes(node.children);
      }
    })
  }

  setChildIds(children) {
    return children.map((child) => (child.id));
  }

  moveNode(nodeBeingMovedId, siblingNodeId, parentId) {
    let nodeBeingMoved = getNodeFromId(nodeBeingMovedId, this.flatNodes);
    
    // remove the association of the node from its previous parent.
    removeNodeFromPreviousLocation(nodeBeingMoved, this.flatNodes);

    this.addNodeToNewLocation(parentId, nodeBeingMoved, siblingNodeId);
  }

  addNodeToNewLocation(parentId, nodeBeingMoved, siblingNodeId) {
    if((parentId === null) || (parentId === undefined)) {
      parentId = -1;
    }

    let parentNode = getNodeFromId(parentId, this.flatNodes);
    // associate the node with its new parent.
    this.addToParentNodeChildren(parentNode, nodeBeingMoved, siblingNodeId);
  }

  addToParentNodeChildren(parentNode, nodeBeingMoved, siblingNodeId) {
    nodeBeingMoved.parent_id = parentNode.id;

    if(siblingNodeId) {
      let previousIndex = parentNode.child_ids.indexOf(siblingNodeId);
      parentNode.children.splice(previousIndex, 0, nodeBeingMoved);
      parentNode.child_ids.splice(previousIndex, 0, nodeBeingMoved.id);
    } else {
      parentNode.children.push(nodeBeingMoved);
      parentNode.child_ids.push(nodeBeingMoved.id);
    }

    if(nodeBeingMoved.previewPath) {
      this.updateSecondaryText(parentNode, nodeBeingMoved);
    }
  }

  updateSecondaryText(parentNode, nodeBeingMoved) {
    let parentSecondary = parentNode.secondary ? parentNode.secondary : '';
    let slashIndex = nodeBeingMoved.secondary.lastIndexOf('/');
    let originalPath = nodeBeingMoved.secondary.substr(slashIndex);
    nodeBeingMoved.secondary = `${parentSecondary}${originalPath}`
    
    if(nodeBeingMoved.previewPath) {
      nodeBeingMoved.previewPath = nodeBeingMoved.secondary;
    }

    if(nodeBeingMoved.children.length > 0) {
      nodeBeingMoved.children.forEach((childNode) => {
        this.updateSecondaryText(nodeBeingMoved, childNode);
      })
    }
    return;
  }

  /**
   * Updates the position of an item that is being moved.
   * @param  {int} movedItemId Unique id of the item that is being moved.
   * @param  {int or null} nextItemId  Unique id of the item that below where the item was moved to.
   * @param  {int} targetParentId  Unique id of the parent that moveItem will belong to.
   * @return undefined
   */
  updateTree(movedItemId, nextItemId, targetParentId) {
    this.moveNode(movedItemId, nextItemId, targetParentId);
  }

  // http://ejohn.org/blog/comparing-document-position/
  _contains(a, b){   
    if(a.contains) {
      return (a !== b) && (!a.contains(b))
    } else {
      return !!(a.compareDocumentPosition(b) & 16);
    } 
  }
}

function removeNodeFromPreviousLocation(nodeBeingMoved, arrayToRemoveFrom) {
  let parentNode = getNodeFromId(nodeBeingMoved.parent_id, arrayToRemoveFrom);
  let childIndex = parentNode.child_ids.indexOf(nodeBeingMoved.id);
  
  nodeBeingMoved.parent_id = null;
  parentNode.child_ids.splice(childIndex, 1);
  parentNode.children.splice(childIndex, 1);
}


function getNodeFromId(nodeId, nodeArray) {
  if(nodeId === null) {
    nodeId = -1;
  }

  return find(nodeArray, (node) => {
    return node.id === nodeId
  });
}

export function makeMinimalArray(flatNodes) {
  let minimalArray = [];
  
  if(!flatNodes) {
    return minimalArray;
  }

  flatNodes.forEach((node) => {
    minimalArray.push({id: node.id, parent_id: node.parent_id});
  })
  return minimalArray;
}

export function deleteNode(flatNodes, nodeToRemoveId) {
  let nodeToRemove = getNodeFromId(nodeToRemoveId);
  removeNodeFromPreviousLocation(nodeToRemove, flatNodes)
}