import find from 'lodash.find';

export default class TreeHelper {
  constructor(treeData) {

    this.buildLookupStructures = this.buildLookupStructures.bind(this);
    this.setChildIds = this.setChildIds.bind(this);
    this.getNodeFromId = this.getNodeFromId.bind(this);
    this.moveNode = this.moveNode.bind(this);
    this.moveNode = this.moveNode.bind(this);
    this.addNodeToNewLocation = this.addNodeToNewLocation.bind(this);
    this.addToParentNodeChildren = this.addToParentNodeChildren.bind(this);
    this.removeNodeFromPreviousLocation = this.removeNodeFromPreviousLocation.bind(this);
    this.updateSecondaryText = this.updateSecondaryText.bind(this);
    this.updateTree = this.updateTree.bind(this);
    this.minimalArray = this.minimalArray.bind(this);

    const rootNode = {id: -1, children: treeData, child_ids: this.setChildIds(treeData)};

    this.flatNodes = [rootNode]

    this.buildLookupStructures(treeData);

    this.flatNodes = this.flatNodes.map((node) => (node.id));
  }

  /**
   * Build an array that contains the model ids of the nodes in the tree.
   * @param  {Array} treeData - A nested array of nodes. 
   * @return undefined
   */
  buildLookupStructures(treeData) {
    treeData.forEach((node) => {
      // this.flatNodes.push(node.id);
      this.flatNodes.push(node);
      if(node.children && (node.children.length > 0)) {
        this.buildLookupStructures(node.children);
      }
    })
  }

  setChildIds(children) {
    return children.map((child) => (child.id));
  }

  getNodeFromId(parentId) {
    return find(this.flatNodes, (node) => (node.id == parentId));
  }

  moveNode(nodeBeingMovedId, siblingNodeId, parentId) {
    let nodeBeingMoved = this.getNodeFromId(nodeBeingMovedId);
    
    // remove the association of the node from its previous parent.
    this.removeNodeFromPreviousLocation(nodeBeingMoved);

    this.addNodeToNewLocation(parentId, nodeBeingMoved, siblingNodeId);
  }

  addNodeToNewLocation(parentId, nodeBeingMoved, siblingNodeId) {
    if(!parentId) {
      parentId = -1;
    }
    
    let parentNode = this.getNodeFromId(parentId);
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

  removeNodeFromPreviousLocation(nodeBeingMoved) {
    let parentNode = this.getNodeFromId(nodeBeingMoved.parent_id);
    let childIndex = parentNode.child_ids.indexOf(nodeBeingMoved.id);
    
    nodeBeingMoved.parent_id = null;
    parentNode.child_ids.splice(childIndex, 1);
    parentNode.children.splice(childIndex, 1);
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

  minimalArray() {
    return this.flatNodes.map((node) => ({id: node.id, parent_id: node.parent_id}))
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
