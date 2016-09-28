export default class TreeHelper {
  constructor(nestedArray) {

    this.nodeArray = []; // An array to hold objects representing nodes in a tree.
    this.lookupArray = []; // will contain only model_ids of items stored in nodeArray for quick lookup.

    // bind 'this' to functions
    this.insertIntoNodeArray = this._insertIntoNodeArray.bind(this);
    this.walk                = this._walk.bind(this);
    this.updateOrder         = this._updateOrder.bind(this);
    this.contains            = this._contains.bind(this);
    this.updateParentIndexes = this.updateParentIndexes.bind(this);
    this.updateChildIndexes  = this.updateChildIndexes.bind(this);
    this.removeItem          = this.removeItem.bind(this);
    
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
   * @param  {int} indexToRemoveFrom - The index at which the item is to be removed.
   * @return {Object}                - A minimal representation of the the item that was removed
   *                                   from the nodeArray.
   */
  removeItem(indexToRemoveFrom) {
    let itemsRemoved = this.nodeArray.splice(indexToRemoveFrom, 1);
    this.lookupArray.splice(indexToRemoveFrom, 1);
    return itemsRemoved[0];
  }

  /**
   * Updates child item parentIndex values for items that have parentIndex values
   * that are greater than the startingIndex value provided.
   * @param  {int} startingIndex - The index value to compare parentIndexes against.
   * @param  {boolean} increase  - Determines whether parentIndexes that are > than
   *                               startingIndex should be increased or decreased.
   * @return undefined
   */
  updateParentIndexes(startingIndex){
    // console.log('startingIndex ', startingIndex);
    // console.log('startingIndex ', startingIndex);
    for(let i = 1; i < this.lookupArray.length; i++){
      if(this.nodeArray[i].parentIndex >= startingIndex){
        this.nodeArray[i].parentIndex++
      } else if(this.nodeArray[i].parentIndex > 0) {
        this.nodeArray[i].parentIndex--
      }
    }
    // console.log(this.nodeArray)
  }

  updateChildIndexes(startingIndex){
    for(let i = 1; i < this.lookupArray.length; i++){
      if(this.nodeArray[i].childIndexes.length > 0){
        for(let j = 0; j < this.nodeArray[i].childIndexes.length; j++){
          if(this.nodeArray[i].childIndexes[j] >= startingIndex){
            this.nodeArray[i].childIndexes[j]++
          } else {
            this.nodeArray[i].childIndexes[j]--
          }
        }
      }
    }
  }

  /**
   * Updates the nodeArray
   * @param  {int} movedItemId Unique id of the item that is being moved.
   * @param  {int or null} siblingNodeId  Unique id of the item that below where the other item was moved to.
   * @return undefined
   */
  _updateOrder(movedItemId, siblingNodeId, targetParentId) {

    // find the index for the node to be moved by using the lookupArray
    //
    let indexOfMovedItem = this.lookupArray.indexOf(movedItemId);
    // get the actual item that will be moved in the nodeArray
    // 
    let nodeToUpdate = this.nodeArray[indexOfMovedItem];

    if(nodeToUpdate.parentIndex !== -1){
      // Get the index at which the item is referenced in its parent's childIndexes array.
      // 
      // 
      let childArrayIndex = this.nodeArray[nodeToUpdate.parentIndex].childIndexes.indexOf(indexOfMovedItem); 
      // Remove the index reference for the item being moved from its initial parent's childIndexes
      // array.
      // 
      this.nodeArray[nodeToUpdate.parentIndex].childIndexes.splice(childArrayIndex, 1);
    }
    
    // By default set indexToMoveTo to -1 (an index that it could never naturally be set to.)
    //
    let indexToMoveTo = -1;
    // If an explicit targetParentId was passed as a param then set the parentIndex for the item that will be
    // move to the the index at which that parentId is found, otherwise set it to a default of 0.
    //
    let siblingParentIndex = (targetParentId ? this.lookupArray.indexOf(targetParentId) : 0);
    // Instantiate some variables to be used later.
    // 
    let siblingChildIndex;


    // Now that the item has been removed, every item that had a higher index, is now at an index
    // that is one less than what it was before. Update all children that had parentIndexes
    // that were higher than the index of the item that was removed so that they correctly reference
    // the new indexes where their parents are now located.
    // 
    // this.updateParentIndexes(indexOfMovedItem, false);

    // If the siblingNodeId param was null, this indicates that the item is being moved to the end of 
    // the array of child nodes for the parent that it is being moved under. Therefore, behavior will
    // be slightly different than default behavior in this case.
    // 
    if(siblingNodeId !== null) {
      let indexOfSiblingNode = this.lookupArray.indexOf(siblingNodeId);
      indexToMoveTo = indexOfSiblingNode;
      // if the siblinngParentIndex is not the default value of 0, then do not change it
      // as it has been explicitly set.
      if(siblingParentIndex === 0){
        siblingParentIndex = this.nodeArray[indexOfSiblingNode].parentIndex;
      }
      // Get the index reference to the sibling in the parent's childIndexes array.
      // 
      siblingChildIndex = this.nodeArray[siblingParentIndex].childIndexes.indexOf(indexOfSiblingNode)
    } else if(targetParentId) {
      // if theere is an explicit targetParent but there is no sibling then set the index to the index of the
      // explicit parent's index, plus the number of children the parent has + 1 (so it goes after all other children)
      indexToMoveTo = siblingParentIndex + this.nodeArray[siblingParentIndex].childIndexes.length + 1;
    }

    // Remove the item from its previous location in the nodeArray and lookupArray.
    //
    let itemRemoved = this.removeItem(indexOfMovedItem);
    
    // Change the parentIndex of the item being moved to the index of the parent item that 
    // it will be nested under.
    // 
    itemRemoved.parentIndex = siblingParentIndex;

    // if the indexToMoveTo value is the default value of -1 then the requested move is to
    // move the item to the end of the list.
    // 
    if(indexToMoveTo === -1){
      // can use length because the array is currently 1 shorter than it should be
      // because the item was removed from its previous index.
      // 
      indexToMoveTo = this.nodeArray.length; 
      // Add the item into the end of the nodeArray and its model_id into the lookupArray.
      // 
      this.nodeArray.push(itemRemoved)
      this.lookupArray.push(itemRemoved.model_id)
    } else {
      this.nodeArray.splice(indexToMoveTo, 0, itemRemoved);
      this.lookupArray.splice(indexToMoveTo, 0, itemRemoved.model_id);
      
      this.updateParentIndexes(indexToMoveTo);
      this.updateChildIndexes(indexToMoveTo);
    }

    // if the item that was moved had items nested under it then update their parentIndex to the
    // index that the item has been moved to (indexToMoveTo)
    // 
    // if(itemRemoved.childIndexes.length > 0) {
    //   itemRemoved.childIndexes.forEach((index) => {
    //     this.nodeArray[index].parentIndex = indexToMoveTo;
    //   })
    // }
    
    // Add an index reference to the moved item into its parent's childIndexes array.
    // 
    if(siblingChildIndex) {
      this.nodeArray[siblingParentIndex].childIndexes.splice(siblingChildIndex, 0, indexToMoveTo)
    } else {
      // If there was no siblingChildIndex specified, then the item must be at the last child item
      // of its parent. Therefore, push the index reference to the end of the parent's
      // childNOdeIndexes array.
      // 
      this.nodeArray[siblingParentIndex].childIndexes.push(indexToMoveTo);
    }
  }

  // http://ejohn.org/blog/comparing-document-position/
  _contains(a, b){
    return a.contains ?
      a != b && a.contains(b) :
      !!(a.compareDocumentPosition(b) & 16);
  }
}
