export default class TreeHelper {
  constructor(nestedArray) {
    // Set according to param or default to an object
    // with no children.
    this.nestedArray = nestedArray;
    this.tree = {};
    this.nodeArray = [];
    this.idLookupArray = []; // will contain only model_ids of items stored in nodeArray for quick lookup.

    // bind this to functions
    this.insertIntoNodeArray = this._insertIntoNodeArray.bind(this);
    this.walk                = this._walk.bind(this);
    this.update              = this._update.bind(this);

    let rootNode = {model_id: -1, childNodeIndexes: []};
    this.nodeArray.push(rootNode);

    if(this.nestedArray && this.nestedArray.length > 0) {
      // build a flat array that represents the order that the nodes display in.
      this.walk(this.nestedArray, 0);
    }
    console.log(this.nodeArray)
  }
  /**
   * Create an array of nodes in the order that they appear.
   * @param  {Array<Object>} treeNodes  - an array of nodes from the tree object used 
   *                                      to create this instance.
   * @param  {int} parentIndex          - The index of the entry in the nodeArray
   *                                      that corresponds to where this nodes parent is.
   * @return undefined
   */
  _walk(treeNodes, parentIndex) { 
    treeNodes.forEach((treeNode, i) => {
      this.insertIntoNodeArray(treeNode, parentIndex);
      if(treeNode.children.length > 0) {
        this.walk(treeNode.children, (parentIndex + (i + 1)));
      }
    });
  }
  _insertIntoNodeArray(treeNode, parentIndex){
    let nodeArrayItem = {};
    let nodeItemIndex = 0;

    nodeArrayItem.model_id = treeNode.id;
    nodeArrayItem.childNodeIndexes = [];
    // if this object has a parent then assign 
    if (parentIndex) {
      nodeArrayItem.parentIndex = parentIndex;
    } else {
      nodeArrayItem.parentIndex = 0;
    }
    // push this node to the large array of all nodes.
    this.nodeArray.push(nodeArrayItem);
    nodeItemIndex = this.nodeArray.length - 1;

    // Either initialize childNodeIndexs or push to existing array.
    this.nodeArray[parentIndex].childNodeIndexes.push(nodeItemIndex);
    
    return nodeItemIndex;
  }
  // _getSiblingIndexes(childIndex, parentItem) {
  //   let childNodeIndex = parentItem.childNodeIndexes.indexOf(childIndex);
  //   let siblings = [];
  //   siblings.push(this.getPrevIndex(childNodeIndex));
  //   siblings.push(this.getNextIndex(parentItem.childNodeIndexes.length, childNodeIndex));
  //   return siblings;
  // }
  // _getPrevIndex(childIndex) {
  //   if(childIndex > 0) {
  //     return childIndex - 1;
  //   } else {
  //     return null;
  //   }
  // }
  // _getNextIndex(childIndexCount, childIndex) {
  //   if((childIndexCount - 1) < childIndex) {
  //     return childIndex + 1;
  //   } else {
  //     return null;
  //   }
  // }
  // _getNextSibling(parentItem, childNodeIndex){
  //   let nextSiblingIndex = this.getNextIndex(parentItem.childNodeIndexes.length, childNodeIndex);
  //   if(nextSiblingIndex === null) {
  //     return null;
  //   }
  //   return this.getNodeItem(parentItem.childNodeIndexes[nextSiblingIndex]);
  // }
  // _getPrevSibling(parentItem, childNodeIndex){
  //   let prevSiblingIndex = this.getPrevIndex(childNodeIndex);
  //   if(prevSiblingIndex === null) {
  //     return null;
  //   }
  //   return this.getNodeItem(parentItem.childNodeIndexes[prevSiblingIndex]);
  // }

  // _getSiblingItems(parentItem, childIndex) {
  //   let childNodeIndex = parentItem.childNodeIndexes.indexOf(childIndex);
  //   let siblingItems = [];
  //   siblingItems.push(this.getPrevSibling(parentItem, childNodeIndex));
  //   siblingItems.push(this.getNextSibling(parentItem, childNodeIndex));
  //   return siblingItems;
  // }

  // /**
  //  * Remove an item from the nodeArray by splicing it out.
  //  * @param  {[type]} index [description]
  //  * @return {[type]}       [description]
  //  */
  // _getNumberToSplice(index) {
  //   let numToSplice = 1;
  //   let nodeArrayItem = this.nodeArray[index];

  //   if(nodeArrayItem.childNodeIndexes && nodeArrayItem.childNodeIndexes.length) {
  //     for(let i = 0; i < nodeArrayItem.childNodeIndexes.length; i++){
  //       numToSplice += this.getNumberToSplice(nodeArrayItem.childNodeIndexes[i])
  //     }
  //   }
  //   // return the number of items to splice
  //   return numToSplice;
  // }

  /**
   * Updates the nodeArray
   * @param  {int} nodeToUpdateId Unique id of the item that is being moved.
   * @param  {int or null} siblingNodeId  Unique id of the item that below where the other item was moved to.
   * @return undefined
   */
  _update(nodeToUpdateId, siblingNodeId) {
    // find the entry in nodeArray based on the id provided
    // 
    // find the entry of the sibling node based on the id provided
    // 
    // Get the current parent of the entry that is being removed
    // 
    // remove the item's index from the parent's array of childItemIndexes
    // 
    // Get parent of the sibling item, if the sibling item does not have a parentIndex then the 
    // parent is the root of the tree.
    // 
    // Add the moved item's index to the array of childItemIndexes for the siblings parent
  }
}
