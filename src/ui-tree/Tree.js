export default class Tree {
  constructor(treeObject) {
    // Set according to param or default to an object
    // with no children.
    this.treeObject = treeObject || {children:[]};
    this.tree = {};
    this.nodeArray = [];
    // bind this to functions
    this.insertIntoNodeArray     = this._insertIntoNodeArray.bind(this);
    this.walk                = this._walk.bind(this);
    this.getNumberToSplice   = this._getNumberToSplice.bind(this);
    this.remove              = this._remove.bind(this);
    this.insert              = this._insert.bind(this);
    this.getNodeItem         = this._getNodeItem.bind(this);
    // this.initNextIndex   = this._initNextIndex.bind(this);
    // this.initPrevIndex   = this._initPrevIndex.bind(this);
    this.insertBefore        = this._insertBefore.bind(this);
    this.insertAfter         = this._insertAfter.bind(this);
    this.prepend             = this._prepend.bind(this);
    this.append              = this._append.bind(this);
    this.updateNodesPosition = this._updateNodesPosition.bind(this);
    this.move                = this._move.bind(this);
    this.getNodeByTop        = this._getNodeByTop.bind(this);
    this.getSiblingIndexes = this._getSiblingIndexes.bind(this)
    this.getPrevIndex = this._getPrevIndex.bind(this)
    this.getNextIndex = this._getNextIndex.bind(this)
    this.getNextSibling = this._getNextSibling.bind(this)
    this.getPrevSibling = this._getPrevSibling.bind(this)
    this.getSiblingItems = this._getSiblingItems.bind(this)

    let rootNode = {node: this.treeObject, childNodeIndexes: []};
    this.nodeArray.push(rootNode);

    if(this.treeObject.children && this.treeObject.children.length) {
      this.walk(this.treeObject.children, 0);
    }
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
    treeNodes.forEach((treeNode) => {
      this.insertIntoNodeArray(treeNode, parentIndex);
    });
  }
  _insertIntoNodeArray(treeNode, parentIndex){
    let nodeArrayItem = {};
    let nodeItemIndex = 0;
    // let children = [];

    nodeArrayItem.node = treeNode;
    // if this object has a parent then assign 
    if (parentIndex) {
      nodeArrayItem.parentIndex = parentIndex;
    } else {
      nodeArrayItem.parentIndex = null;
    }
    // push this node to the large array of all nodes.
    this.nodeArray.push(nodeArrayItem);
    nodeItemIndex = this.nodeArray.length - 1;

    this.nodeArray[parentIndex].childNodeIndexes.push(nodeItemIndex);
    // if the node has children then add them to the nodeArray next.
    if (treeNode.children && treeNode.children.length) {
      this.walk(treeNode.children, nodeItemIndex);
    }
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

  // _initPrevAndNextIndexes(siblingsCount, childIndex, parentIndex){
  //   this.nodeArray[parentIndex].children[childIndex].nextIndex = this.initNextIndex(siblingsCount, childIndex);
  //   this.nodeArray[parentIndex].children[childIndex].prevIndex = this.initPrevIndex(siblingsCount, childIndex);
  // }
  // _initNextIndex(siblingsCount, index){
  //   if((siblingsCount - 1) < index) {
  //     return index + 1;
  //   } else {
  //     return null;
  //   }
  // }
  // _initPrevIndex(siblingsCount, index){
  //   if(index > 0) {
  //     return index - 1;
  //   } else {
  //     return null;
  //   }
  // }
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
    let parentNode = this.nodeArray[this.nodeArray[index].parent_id];
    // remove from the parent's list of children
    parentNode.node.children.splice(parentNode.children.indexOf(this.nodeArray[index].node), 1);
    // splice from the list of childNodeIndexes
    parentNode.childNodeIndexes.splice(parentNode.childNodeIndexes.indexOf(index), 1);
    // update the parent node.
    this.nodeArray[parentNode.id] = parentNode; 
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
  _insert(treeNode, parentIndex, i) {
    let parentArrayNodeItem = this.nodeArray[parentIndex];
    let parentTreeNode      = parentArrayNodeItem.node;
    let newNodeIndex        = this.insertIntoNodeArray(parentTreeNode)
    
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
    // let parentNodeArrayItem = this.nodeArray[destNodeArrayItem.parentIndex];
    let indexToInsertAt     = this.nodeArray[destNodeArrayItem.parentIndex].childNodeIndexes.indexOf(destIndex);
    return this.insert(newNodeArrayItem, destNodeArrayItem.parentIndex, indexToInsertAt);
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
  _updateNodesPosition() {
    var top = 1;
    var left = 1;
    var root = this.getNodeItem(0);
    var self = this;

    root.top = top++;
    root.left = left++;

    if(root.childNodeIndexes && root.childNodeIndexes.length) {
      walk(root.childNodeIndexes, root, left, root.node.collapsed);
    }

    function walk(childIndexes, parent, left, collapsed) {
      var height = 1;
      
      for(let i = 0; i < childIndexes; i++){
        var node = self.getNodeItem(childIndexes[i]);
        if(collapsed) {
          node.top = null;
          node.left = null;
        } else {
          node.top = top++;
          node.left = left;
        }

        if(node.childNodeIndexes && node.childNodeIndexes.length) {
          height += walk(node.childNodeIndexes, node, left+1, collapsed || node.node.collapsed);
        } else {
          node.height = 1;
          height += 1;
        }
      }

      if(parent.node.collapsed) parent.height = 1;
      else parent.height = height;
      return parent.height;
    }
  }
  _move(prevIndex, newIndex, placement) {
    if(prevIndex === newIndex || newIndex === 1) return;

    var nodeArrayItem = this.remove(prevIndex);
    var nodeArrayIndex = null;

    if(placement === 'before') nodeArrayIndex = this.insertBefore(nodeArrayItem, newIndex);
    else if(placement === 'after') nodeArrayIndex = this.insertAfter(nodeArrayItem, newIndex);
    else if(placement === 'prepend') nodeArrayIndex = this.prepend(nodeArrayItem, newIndex);
    else if(placement === 'append') nodeArrayIndex = this.append(nodeArrayItem, newIndex);

    // TODO: refactor
    // this.updateNodesPosition();
    return nodeArrayIndex;
  }
  _getNodeByTop(top) {
    var indexes = this.indexes;
    for(var id in indexes) {
      if(indexes.hasOwnProperty(id)) {
        if(indexes[id].top === top) return indexes[id];
      }
    }
  }
}
