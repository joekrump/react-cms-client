export default class TreeHelper {
  constructor(nestedArray) {
    // Set according to param or default to an object
    // with no children.
    this.nestedArray = nestedArray;
    this.tree = {};
    this.nodeArray = [];
    // bind this to functions
    this.insertIntoNodeArray     = this._insertIntoNodeArray.bind(this);
    this.walk                = this._walk.bind(this);
    this.getNumberToSplice   = this._getNumberToSplice.bind(this);
    this.remove              = this._remove.bind(this);
    this.update              = this._update.bind(this);
    this.getNodeItem         = this._getNodeItem.bind(this);
    this.insertBefore        = this._insertBefore.bind(this);
    this.insertAfter         = this._insertAfter.bind(this);
    this.prepend             = this._prepend.bind(this);
    this.append              = this._append.bind(this);
    this.move                = this._move.bind(this);
    this.getSiblingIndexes = this._getSiblingIndexes.bind(this)
    this.getPrevIndex = this._getPrevIndex.bind(this)
    this.getNextIndex = this._getNextIndex.bind(this)
    this.getNextSibling = this._getNextSibling.bind(this)
    this.getPrevSibling = this._getPrevSibling.bind(this)
    this.getSiblingItems = this._getSiblingItems.bind(this)

    let rootNode = {node: {children: this.nestedArray}, childNodeIndexes: []};
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

    nodeArrayItem.node = treeNode;
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
  _getSiblingIndexes(childIndex, parentItem) {
    let childNodeIndex = parentItem.childNodeIndexes.indexOf(childIndex);
    let siblings = [];
    siblings.push(this.getPrevIndex(childNodeIndex));
    siblings.push(this.getNextIndex(parentItem.childNodeIndexes.length, childNodeIndex));
    return siblings;
  }
  _getPrevIndex(childIndex) {
    if(childIndex > 0) {
      return childIndex - 1;
    } else {
      return null;
    }
  }
  _getNextIndex(childIndexCount, childIndex) {
    if((childIndexCount - 1) < childIndex) {
      return childIndex + 1;
    } else {
      return null;
    }
  }
  _getNextSibling(parentItem, childNodeIndex){
    let nextSiblingIndex = this.getNextIndex(parentItem.childNodeIndexes.length, childNodeIndex);
    if(nextSiblingIndex === null) {
      return null;
    }
    return this.getNodeItem(parentItem.childNodeIndexes[nextSiblingIndex]);
  }
  _getPrevSibling(parentItem, childNodeIndex){
    let prevSiblingIndex = this.getPrevIndex(childNodeIndex);
    if(prevSiblingIndex === null) {
      return null;
    }
    return this.getNodeItem(parentItem.childNodeIndexes[prevSiblingIndex]);
  }

  _getSiblingItems(parentItem, childIndex) {
    let childNodeIndex = parentItem.childNodeIndexes.indexOf(childIndex);
    let siblingItems = [];
    siblingItems.push(this.getPrevSibling(parentItem, childNodeIndex));
    siblingItems.push(this.getNextSibling(parentItem, childNodeIndex));
    return siblingItems;
  }

  /**
   * Remove an item from the nodeArray by splicing it out.
   * @param  {[type]} index [description]
   * @return {[type]}       [description]
   */
  _getNumberToSplice(index) {
    let numToSplice = 1;
    let nodeArrayItem = this.nodeArray[index];

    if(nodeArrayItem.childNodeIndexes && nodeArrayItem.childNodeIndexes.length) {
      for(let i = 0; i < nodeArrayItem.childNodeIndexes.length; i++){
        numToSplice += this.getNumberToSplice(nodeArrayItem.childNodeIndexes[i])
      }
    }
    // return the number of items to splice
    return numToSplice;
  }
  // remove a node update its parent as well.
  _remove(index) {
    let parentNodeItem = this.nodeArray[this.nodeArray[index].parentIndex];
    console.log(index);
    console.log('parentIndex: ', this.nodeArray[index].parentIndex);
    console.log('parent: ', parentNodeItem)
    // remove from the parent's list of children
    parentNodeItem.node.children.splice(parentNodeItem.node.children.indexOf(this.nodeArray[index].node), 1);
    // splice from the list of childNodeIndexes
    parentNodeItem.childNodeIndexes.splice(parentNodeItem.childNodeIndexes.indexOf(index), 1);
    // update the parent node.
    this.nodeArray[this.nodeArray[index].parentIndex] = parentNodeItem; 
    // remove the item and all its children from nodeArray and then return an array of the items
    // removed.
    // return this.nodeArray.splice(index, this.getNumberToSplice(index));
    return this.nodeArray[index];
  }
  /**
   * Inserts into both tree and array.
   * @param  {[type]} treeNode    [description]
   * @param  {[type]} parentIndex [description]
   * @param  {[type]} i           [description]
   * @return {[type]}             [description]
   */
  _update(nodeToUpdateId, siblingNodeId) {
    let parentArrayNodeItem = this.nodeArray[parentIndex];
    let parentTreeNode      = parentArrayNodeItem.node;
    let newNodeIndex        = this.insertIntoNodeArray(parentTreeNode, parentIndex)
    
    parentArrayNodeItem.childNodeIndexes = parentArrayNodeItem.childNodeIndexes || [];
    parentTreeNode.children              = parentTreeNode.children || [];

    parentArrayNodeItem.childNodeIndexes.splice(i, 0, newNodeIndex);
    parentTreeNode.children.splice(i, 0, treeNode);

    return newNodeIndex;
  }
  /**
   * Insert an item before another item.
   * @param  {[type]} newNodeArrayItem [description]
   * @param  {[type]} destIndex        [description]
   * @return {[type]}                  [description]
   */
  _insertBefore(newNodeArrayItem, destIndex) {
    let destNodeArrayItem   = this.nodeArray[destIndex];
    // console.log('dest node array item: ', destNodeArrayItem);
    // console.log('parentIndex: ', destNodeArrayItem.parentIndex)
    // console.log('Parent: ', this.nodeArray[destNodeArrayItem.parentIndex] )
    let parentIndex = destNodeArrayItem.parentIndex;

    if(destNodeArrayItem.parentIndex === undefined){
      parentIndex = 0;
    }
    // let parentNodeArrayItem = this.nodeArray[destNodeArrayItem.parentIndex];
    let indexToInsertAt = this.nodeArray[parentIndex].childNodeIndexes.indexOf(destIndex);
    return this.insert(newNodeArrayItem, parentIndex, indexToInsertAt);
  }
  /**
   * [_insertAfter description]
   * @param  {[type]} newNodeArrayItem [description]
   * @param  {[type]} destIndex        [description]
   * @return {[type]}                  [description]
   */
  _insertAfter(newNodeArrayItem, destIndex) {
    let destNodeArrayItem   = this.nodeArray[destIndex];
    // let parentNodeArrayItem = this.nodeArray[destNodeArrayItem.parentIndex];
    let indexToInsertAt     = this.nodeArray[destNodeArrayItem.parentIndex].childNodeIndexes.indexOf(destIndex);
    return this.insert(destNodeArrayItem, destNodeArrayItem.parentIndex, indexToInsertAt + 1);
  };
  /**
   * Add a node to the beginning of the array of children for 
   * the parent node of the current tree depth
   * @param  {[type]} newNodeArrayItem [description]
   * @param  {[type]} destIndex        [description]
   * @return {[type]}                  [description]
   */
  _prepend(newNodeArrayItem, destIndex) {
    return this.insert(newNodeArrayItem, destIndex, 0);
  }
  _getNodeItem(index){
    return this.nodeArray[index];
  }
  /**
   * Add an item to the end of the array of children for 
   * the parent node of the current tree depth
   * @param  {[type]} newNodeArrayItem [description]
   * @param  {[type]} destIndex        [description]
   * @return {[type]}                  [description]
   */
  _append(newNodeArrayItem, destIndex) {
    let destNodeArrayItem   = this.nodeArray[destIndex];
    destNodeArrayItem.childNodeIndexes = destNodeArrayItem.childNodeIndexes || [];
    return this.insert(newNodeArrayItem, destIndex, destNodeArrayItem.childNodeIndexes.length);
  }
 
  _move(prevIndex, newIndex, placement) {
    if(prevIndex === newIndex || newIndex === 1) return;

    var nodeArrayItem = this.remove(prevIndex);
    var nodeArrayIndex = null;

    if(placement === 'before') nodeArrayIndex = this.insertBefore(nodeArrayItem, newIndex);
    else if(placement === 'after') nodeArrayIndex = this.insertAfter(nodeArrayItem, newIndex);
    else if(placement === 'prepend') nodeArrayIndex = this.prepend(nodeArrayItem, newIndex);
    else if(placement === 'append') nodeArrayIndex = this.append(nodeArrayItem, newIndex);

    return nodeArrayIndex;
  }
}
