export default class TreeHelper {
  constructor(nestedArray) {

    // An array to hold objects representing nodes in a tree.
    this.nodeArray              = []; 
    // will contain only item_ids of items stored in nodeArray for quick lookup.
    this.lookupArray            = []; 
    this.addNewTreeNode         = this.addNewTreeNode.bind(this);
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
    this.nodeArray.push({item_id: -1, childIndexes: []});
    // push the root item item_id value. Use -1 as it is not a possible natural 
    // id that a model instance could have as their ids are all positive.
    // 
    this.lookupArray.push(-1); 

    if(nestedArray && nestedArray.length > 0) {
      // build a flat array that represents the order that the nodes display in.
      this.walk(nestedArray, 0, -1);
    }
  }

  /**
   * Create a 2D array representation of a tree structure.
   * @param  {Array<Object>} treeNodes  - an array of nodes from the tree object used 
   *                                      to create this instance.
   * @param  {int} parentIndex          - The index of the entry in the nodeArray
   *                                      that corresponds to where this nodes parent is.
   * @param  {int} depth                - The tree depth to insert at.                                     
   * @return undefined
   */
  _walk(treeNodes, parentIndex, depth) { 
    treeNodes.forEach((treeNode, i) => {
      this.addNewTreeNode(treeNode, parentIndex, depth);
      if(treeNode.children && (treeNode.children.length > 0)) {
        this.walk(treeNode.children, (parentIndex + (i + 1)), (depth + 1));
      }
    });
  }

  /**
   * Insert a minimal representation of a tree node into 
   * a 2D array.
   * @param  {object} treeNode    - The object to insert into nodeArray
   * @param  {int} parentIndex    - The index for the parent that treeNode is a child of.
   * @return {int}                - The in nodeArray that the item was inserted at.
   */
  addNewTreeNode(treeNode, parentIndex, parentDepth){
    let nodeArrayItem = {};
    let nodeItemIndex = 0;

    nodeArrayItem.item_id = treeNode.id;
    nodeArrayItem.childIndexes = [];
    nodeArrayItem.depth = parentDepth + 1;
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

    // push this item's parent childIndexes array.
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

  appendItem(removedData){
    this.nodeArray.push(...removedData.items);
    this.lookupArray.push(...removedData.ids);
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
      this.appendItem(removedData);
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
  decrementParentIndexes(startingIndex, amt, arrayofItems = this.nodeArray){
    // start from index 1 because the root at index 0 does not have a parent.
    for(let i = 1; i < arrayofItems.length; i++){
      if(arrayofItems[i].parentIndex > startingIndex){
        arrayofItems[i].parentIndex -= amt;
      }
    }
    return arrayofItems;
  }

  decrementChildIndexes(startingIndex, amt, arrayofItems = this.nodeArray){
    for(let i = 0; i < arrayofItems.length; i++){
      if(arrayofItems[i].childIndexes.length > 0){
        for(let j = 0; j < arrayofItems[i].childIndexes.length; j++){
          if(arrayofItems[i].childIndexes[j] > startingIndex){
            arrayofItems[i].childIndexes[j] -= amt;
          }
        }
      }
    }
    return arrayofItems;
  }

  incrementParentIndexes(startingIndex, amt, arrayofItems = this.nodeArray) {
    for(let i = 1; i < arrayofItems.length; i++){
      if(arrayofItems[i].parentIndex >= startingIndex){
        arrayofItems[i].parentIndex += amt;
      }
    }
    return arrayofItems;
  }

  incrementChildIndexes(startingIndex, amt, arrayofItems = this.nodeArray) {
    for(let i = 0; i < arrayofItems.length; i++){
      if(arrayofItems[i].childIndexes.length > 0){
        for(let j = 0; j < arrayofItems[i].childIndexes.length; j++){
          if(arrayofItems[i].childIndexes[j] >= startingIndex){
            arrayofItems[i].childIndexes[j] += amt;
          }
        }
      }
    }
    return arrayofItems;
  }

  /**
   * Get the index that an item is located based on its item_id
   * @param  {int} id - The item_id of the item to get the index of.
   * @return {int}    - The index of the item.
   */
  getIndexFromId(id) {
    return ((id === null) ? -1 :this.lookupArray.indexOf(id));
  }

  /**
   * Get the item_id of an item that is found at a specific index.
   * @param  {int} index - The index of the item that item_id is being retrieved for.
   * @return {int}       - The item_id of the item at the index.
   */
  getIdFromIndex(index) {
    return this.nodeArray[index].item_id;
  }

  /**
   * Updates the position of an item that is being moved.
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

    // Adjust indexes of items in the array of items being moved.
    removedData.items = this.decrementParentIndexes(startingIndex, removedData.ids.length, removedData.items);
    removedData.items = this.decrementChildIndexes(startingIndex, removedData.ids.length, removedData.items);
    //
    if(parentItemIndex > originalItemIndex) {
      parentItemIndex -= removedData.ids.length;
    }

    if(nextItemIndex > originalItemIndex) {
      nextItemIndex -= removedData.ids.length;
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

    let moveAmt = (newItemIndex - originalItemIndex)

    removedData.items = this.incrementParentIndexes(originalItemIndex, moveAmt, removedData.items);
    removedData.items = this.incrementChildIndexes(originalItemIndex, moveAmt, removedData.items);
    // if the item being moved has a sibling then make sure
    // that the index reference to it is alos incremented in order
    // to reflect the changes after increment emthods have run.
    if(nextItemIndex !== -1){
      nextItemIndex += removedData.ids.length;
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
