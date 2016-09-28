export default class TreeHelper {
  constructor(nestedArray) {

    this.nodeArray = []; // An array to hold objects representing nodes in a tree.
    this.lookupArray = []; // will contain only model_ids of items stored in nodeArray for quick lookup.

    // bind 'this' to functions
    this.insertIntoNodeArray    = this._insertIntoNodeArray.bind(this);
    this.walk                   = this._walk.bind(this);
    this.updateOrder            = this.updateOrder.bind(this);
    this.contains               = this._contains.bind(this);
    this.decrementParentIndexes = this.decrementParentIndexes.bind(this);
    this.decrementChildIndexes  = this.decrementChildIndexes.bind(this);
    this.incrementParentIndexes = this.incrementParentIndexes.bind(this);
    this.incrementChildIndexes  = this.incrementChildIndexes.bind(this);
    this.removeFromChildIndexes = this.removeFromChildIndexes.bind(this);
    this.removeItem             = this.removeItem.bind(this);
    this.addItem                = this.addItem.bind(this);
    this.appendItem             = this.appendItem.bind(this);
    this.injectItem             = this.injectItem.bind(this);
    this.getIndexFromId         = this.getIndexFromId.bind(this);
    this.getIdFromIndex         = this.getIdFromIndex.bind(this);
    this.getNumToRemove         = this.getNumToRemove.bind(this);
    this.addChildToParent       = this.addChildToParent.bind(this);
    
    // push the root item to the nodeArray
    // 
    this.nodeArray.push({model_id: -1, childIndexes: []});
    // push the root item model_id value. Use -1 as it is not a possible natural 
    // id that a model instance could have as their ids are all positive.
    // 
    this.lookupArray.push(-1); 

    if(nestedArray && nestedArray.length > 0) {
      // build a flat array that represents the order that the nodes display in.
      this.walk(nestedArray, 0);
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
    treeNodes.forEach((treeNode, i) => {
      this.insertIntoNodeArray(treeNode, parentIndex);
      if(treeNode.children && (treeNode.children.length > 0)) {
        this.walk(treeNode.children, (parentIndex + (i + 1)));
      }
    });
  }

  /**
   * Insert a minimal representation of a tree node into 
   * a 2D array.
   * @param  {[type]} treeNode    [description]
   * @param  {[type]} parentIndex [description]
   * @return {[type]}             [description]
   */
  _insertIntoNodeArray(treeNode, parentIndex){
    let nodeArrayItem = {};
    let nodeItemIndex = 0;

    nodeArrayItem.model_id = treeNode.id;
    nodeArrayItem.childIndexes = [];
    // if this object has a parent then assign 
    if (parentIndex) {
      nodeArrayItem.parentIndex = parentIndex;
    } else {
      nodeArrayItem.parentIndex = 0;
    }
    // push this node to the large array of all nodes.
    this.nodeArray.push(nodeArrayItem);
    this.lookupArray.push(treeNode.id);

    nodeItemIndex = this.nodeArray.length - 1;

    // Either initialize childNodeIndexs or push to existing array.
    this.nodeArray[parentIndex].childIndexes.push(nodeItemIndex);
    
    return nodeItemIndex;
  }

  /**
   * Slice an item from both the lookupArray and nodeArray at a specific 
   * index.
   * @param  {int} index - The index at which the item is to be removed.
   * @return {Object}    - A minimal representation of the the item that was removed
   *                       from the nodeArray.
   */
  removeItem(index, item) {
    this.removeFromChildIndexes(index);
    // get the number of items to remove. so that parents and children are all move together.
    let numToRemove = this.getNumToRemove(item);

    let itemsRemoved = this.nodeArray.splice(index, numToRemove);
    let idsRemoved = this.lookupArray.splice(index, numToRemove);
    return {items: itemsRemoved, ids: idsRemoved};
  }

  getNumToRemove(item) {
    let numToRemove = 1;
    // if the item does not have any childIndexes, return early.
    if(item.childIndexes.length == 0) {
      return numToRemove;
    }

    item.childIndexes.forEach((childIndex) => {
      numToRemove += this.getNumToRemove(this.nodeArray[childIndex]);
    })
    return numToRemove;
  }

  appendItem(itemsArray){
    for(let i = 0; i < itemsArray.length; i++) {
      this.nodeArray.push(itemsArray[i]);
      this.lookupArray.push(itemsArray[i].model_id);
    }
  }
  injectItem(index, removedData) {
    this.nodeArray.splice(index, 0, ...removedData.items);
    this.lookupArray.splice(index, 0, ...removedData.ids);
  }

  addItem(removedData, index, nextIndex) {
    let moveItemRoot = removedData.items[0];
    // add the item into its parent's childIndexes array.
    // if the nextIndex is -1 it indicates that the item
    // is the last child of its parent.
    if(nextIndex === -1 && moveItemRoot.parentIndex === 0){
      this.appendItem(removedData.items);
    } else if(nextIndex === -1) {
      this.injectItem(index, removedData);
    } else {
      this.injectItem(index, removedData);
    }

    this.addChildToParent(moveItemRoot, index, nextIndex);
  }

  addChildToParent(moveItemRoot, index, nextIndex){
    if(nextIndex === -1 && moveItemRoot.parentIndex === 0){
      this.nodeArray[moveItemRoot.parentIndex].childIndexes.push(index);
    } else if(nextIndex === -1) {
      this.nodeArray[moveItemRoot.parentIndex].childIndexes.push(index);
    } else {
      // otherwise splice the item into the array at the index where the
      // nextIndex sibling previously was.
      let childIndexes = this.nodeArray[moveItemRoot.parentIndex].childIndexes;
      let siblingIndex = childIndexes.indexOf(nextIndex);
      this.nodeArray[moveItemRoot.parentIndex].childIndexes.splice(siblingIndex, 0, index);
    }
  }

  removeFromChildIndexes(index){
    let item = this.nodeArray[index];
    this.nodeArray[item.parentIndex].childIndexes.splice(index, 1)
  }

  /**
   * Updates child item parentIndex values for items that have parentIndex values
   * that are greater than the startingIndex value provided.
   * @param  {int} startingIndex - The index value to compare parentIndexes against.
   * @param  {boolean} increase  - Determines whether parentIndexes that are > than
   *                               startingIndex should be increased or decreased.
   * @return undefined
   */
  decrementParentIndexes(startingIndex, amt, arrayToIterateOver = this.nodeArray){
    // start from index 1 because the root at index 0 does not have a parent.
    for(let i = 1; i < arrayToIterateOver.length; i++){
      if(arrayToIterateOver[i].parentIndex > startingIndex){
        arrayToIterateOver[i].parentIndex -= amt;
      }
    }
  }

  decrementChildIndexes(startingIndex, amt, arrayToIterateOver = this.nodeArray){
    for(let i = 0; i < arrayToIterateOver.length; i++){
      if(arrayToIterateOver[i].childIndexes.length > 0){
        for(let j = 0; j < arrayToIterateOver[i].childIndexes.length; j++){
          if(arrayToIterateOver[i].childIndexes[j] > startingIndex){
            arrayToIterateOver[i].childIndexes[j] -= amt;
          }
        }
      }
    }
  }

  incrementParentIndexes(startingIndex, amt, arrayToIterateOver = this.nodeArray) {
    for(let i = 1; i < arrayToIterateOver.length; i++){
      if(arrayToIterateOver[i].parentIndex >= startingIndex){
        arrayToIterateOver[i].parentIndex += amt;
      }
    }
  }

  incrementChildIndexes(startingIndex, amt, arrayToIterateOver = this.nodeArray) {
    for(let i = 0; i < arrayToIterateOver.length; i++){
      if(arrayToIterateOver[i].childIndexes.length > 0){
        for(let j = 0; j < arrayToIterateOver[i].childIndexes.length; j++){
          if(arrayToIterateOver[i].childIndexes[j] >= startingIndex){
            arrayToIterateOver[i].childIndexes[j] += amt;
          }
        }
      }
    }
  }

  getIndexFromId(id) {
    return ((id === null) ? -1 :this.lookupArray.indexOf(id));
  }

  getIdFromIndex(index) {
    return this.nodeArray[index].model_id;
  }
  /**
   * Updates the nodeArray
   * @param  {int} movedItemId Unique id of the item that is being moved.
   * @param  {int or null} nextItemId  Unique id of the item that below where the item was moved to.
   * @param  {int} targetParentId  Unique id of the parent that moveItem will belong to.
   * @return undefined
   */
  updateOrder(movedItemId, nextItemId, targetParentId) {

    // find the item in the lookup
    let originalItemIndex = this.getIndexFromId(movedItemId);
    let originalMovedItem = this.nodeArray[originalItemIndex];
    // find the index of the next item in the lookup if one is provided, otherwise assign default of -1
    let nextItemIndex = this.getIndexFromId(nextItemId);
    // if no targetParentId was provided...
    if(typeof(targetParentId) === 'undefined') {
      // if item has no sibling, only assumption that can be made is that the target is the root.
      // Otherwise, the parent is the parent of the sibling.
      targetParentId = nextItemId === null ? -1 : this.getIdFromIndex(this.nodeArray[nextItemIndex].parentIndex);
    }
    // Get the parent that the item is moving to.
    let parentItemIndex = this.getIndexFromId(targetParentId);
    // remove the item from the nodeArray
    let removedData = this.removeItem(originalItemIndex, originalMovedItem);
    let newItemIndex;
    let startingIndex = originalItemIndex + (removedData.ids.length - 1);
    // update the childIndexes references and parentIndex references
    this.decrementParentIndexes(startingIndex, removedData.ids.length);
    this.decrementChildIndexes(startingIndex, removedData.ids.length);
    //
    if(parentItemIndex > originalItemIndex) {
      parentItemIndex--;
    }

    if(nextItemIndex > originalItemIndex) {
      nextItemIndex--;
    }
    // update the first item that was removed. It is the parent of any other items that were updated.
    // therefore it is safe to update its parentIndex to the current value of parentItemIndex.
    removedData.items[0].parentIndex = parentItemIndex;
    // if the moved item has an item after it, then insert the item at the next item index
    // 
    if(nextItemIndex !== -1){
      newItemIndex = nextItemIndex; 
    } else {
      // otherwise, add in right after the parent
      newItemIndex = parentItemIndex + 1;
    }
    // items that have indexes great than or equal to the index that the item
    // is being moved to, will be pushed up by the amount equal to the number
    // of items that were removed, therefore update all reference
    // indexes that are >= the newItemIndex
    this.incrementParentIndexes(newItemIndex, removedData.ids.length);
    this.incrementChildIndexes(newItemIndex, removedData.ids.length);
    // if the item being moved has a sibling then make sure
    // that the index reference to it is alos incremented in order
    // to reflect the changes after increment emthods have run.
    if(nextItemIndex !== -1){
      nextItemIndex++;
    }
    this.addItem(removedData, newItemIndex, nextItemIndex);

  }


  // http://ejohn.org/blog/comparing-document-position/
  _contains(a, b){
    return a.contains ?
      a != b && a.contains(b) :
      !!(a.compareDocumentPosition(b) & 16);
  }
}
