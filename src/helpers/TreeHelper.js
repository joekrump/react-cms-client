export default class TreeHelper {
  constructor(nestedArray) {
    // Set according to param or default to an object
    // with no children.
    this.nestedArray = nestedArray;
    this.tree = {};
    this.nodeArray = [];
    this.lookupArray = []; // will contain only model_ids of items stored in nodeArray for quick lookup.

    // bind this to functions
    this.insertIntoNodeArray = this._insertIntoNodeArray.bind(this);
    this.walk                = this._walk.bind(this);
    this.updateOrder         = this._updateOrder.bind(this);
    this.contains            = this._contains.bind(this);
    this.updateParentIndexes = this.updateParentIndexes.bind(this);
    
    this.nodeArray.push({model_id: -1, childNodeIndexes: []}); // push the root value
    this.lookupArray.push(-1); // push the root value

    if(this.nestedArray && this.nestedArray.length > 0) {
      // build a flat array that represents the order that the nodes display in.
      this.walk(this.nestedArray, 0);
    }
    console.log(this.nodeArray)
    console.log(this.lookupArray)
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
    this.lookupArray.push(treeNode.id);

    nodeItemIndex = this.nodeArray.length - 1;

    // Either initialize childNodeIndexs or push to existing array.
    this.nodeArray[parentIndex].childNodeIndexes.push(nodeItemIndex);
    
    return nodeItemIndex;
  }

  updateParentIndexes(startingIndex, increase){
    for(let i = 0; i < this.lookupArray.length; i++){
      if(this.nodeArray[i].parentIndex > startingIndex){
        if(increase) {
          this.nodeArray[i].parentIndex++
        } else {
          this.nodeArray[i].parentIndex--
        }
      }
    }
  }
  /**
   * Updates the nodeArray
   * @param  {int} nodeToUpdateId Unique id of the item that is being moved.
   * @param  {int or null} siblingNodeId  Unique id of the item that below where the other item was moved to.
   * @return undefined
   */
  _updateOrder(nodeToUpdateId, siblingNodeId, targetParentId) {

    // find the index for the node to be moved by using the lookupArray
    //
    let indexOfUpdateNode = this.lookupArray.indexOf(nodeToUpdateId);
    // get the actual item that will be moved in the nodeArray
    // 
    let nodeToUpdate = this.nodeArray[indexOfUpdateNode];
    // Get the index at which the item is referenced in its parent's childNodeIndexes array.
    // 
    let childArrayIndex = this.nodeArray[nodeToUpdate.parentIndex].childNodeIndexes.indexOf(indexOfUpdateNode); 
    // By default set indexToMoveTo to -1 (an index that it could never naturally be set to.)
    //
    let indexToMoveTo = -1;
    // If an explicit targetParentId was passed as a param then set the parentIndex for the item that will be
    // move to the the index at which that parentId is found, otherwise set it to a default of 0.
    //
    let siblingParentIndex = (targetParentId ? this.lookupArray.indexOf(targetParentId) : 0);
    // Instantiate some variables to be used later.
    // 
    let siblingChildIndex, newSiblingIndex;

    // Remove the item to be moved from its current position in the nodeArray and lookupArray
    // 
    this.nodeArray[nodeToUpdate.parentIndex].childNodeIndexes.splice(childArrayIndex, 1);
    // Now that the item has been removed, every item that had a higher index, is now at an index
    // that is one less than what it was before. Update all children that had parentIndexes
    // that were higher than the index of the item that was removed so that they correctly reference
    // the new indexes where their parents are now located.
    // 
    this.updateParentIndexes(indexOfUpdateNode, false);

    // If the siblingNodeId param was null, this indicates that the item is being moved to the end of 
    // the array of child nodes for the parent that it is being moved under. Therefore, behavior will
    // be slightly different than default behavior in this case.
    // 
    if(siblingNodeId !== null) {
      let indexOfSiblingNode = this.lookupArray.indexOf(siblingNodeId);
      indexToMoveTo = indexOfSiblingNode;
      if(siblingParentIndex === 0){
        siblingParentIndex = this.nodeArray[indexOfSiblingNode].parentIndex;
      }
      // Add the item to the siblings parent
      siblingChildIndex = this.nodeArray[siblingParentIndex].childNodeIndexes.indexOf(indexOfSiblingNode)
    } else if(targetParentId) {
      // if theere is an explicit targetParent but there is no sibling then set the index to the index of the
      // explicit parent's index, plus the number of children the parent has + 1 (so it goes after all other children)
      indexToMoveTo = siblingParentIndex + this.nodeArray[siblingParentIndex].childNodeIndexes.length + 1;
    }

    console.log('SIBLING PARENT INDEX: ', siblingParentIndex)
    console.log('INDEX TO MOVE TO: ', indexToMoveTo)
    
    console.log('Removing from nodeArray')
    console.log('Previous nodeArray: ', this.nodeArray)
    console.log('Previous lookupArray ', this.lookupArray)
    // Remove the item from its previous index
    //
    let itemsRemoved = this.nodeArray.splice(indexOfUpdateNode, 1);
    // keep the lookup array in the same state as the nodeArray
    this.lookupArray.splice(indexOfUpdateNode, 1);

    console.log('After nodeArray: ', this.nodeArray)
    console.log('After lookupArray ', this.lookupArray)
    
    // update the parentIndex for the item
    itemsRemoved[0].parentIndex = siblingParentIndex;
    
    console.log('Adding Back In')
    if(indexToMoveTo === -1){
      // can use length because the array is currently 1 shorter than it should be
      // because the item was removed from its previous index.
      indexToMoveTo = this.nodeArray.length; 

      this.nodeArray.push(itemsRemoved[0])
      this.lookupArray.push(itemsRemoved[0].model_id)
    } else {
      this.updateParentIndexes((indexToMoveTo - 1), true);
      this.nodeArray.splice(indexToMoveTo, 0, itemsRemoved[0]);
      this.lookupArray.splice(indexToMoveTo, 0, itemsRemoved[0].model_id);
      newSiblingIndex = indexToMoveTo + 1;
    }

    // if the node that was moved had children, then update their parentIndex to the indexToMoveTo.
    // 
    if(itemsRemoved[0].childNodeIndexes.length > 0) {
      itemsRemoved[0].childNodeIndexes.forEach((index) => {
        console.log('previous parentIndex: ', this.nodeArray[index].parentIndex)
        this.nodeArray[index].parentIndex = indexToMoveTo;
        console.log('new parentIndex: ', this.nodeArray[index].parentIndex)
      })
    }

    console.log('After Add nodeArray: ', this.nodeArray)
    console.log('After Add lookupArray: ', this.lookupArray)
    
    console.log('Adding reference to parent')
    console.log('before: ', this.nodeArray[siblingParentIndex].childNodeIndexes)
    if(siblingChildIndex) {
      this.nodeArray[siblingParentIndex].childNodeIndexes.splice((siblingChildIndex + 1), 0, indexToMoveTo)
      console.log('after: ', this.nodeArray[siblingParentIndex].childNodeIndexes)
    } else {
      // otherwise push to the end of the childNodeIndex array for the parent.
      this.nodeArray[siblingParentIndex].childNodeIndexes.push(indexToMoveTo);
      console.log('after: ', this.nodeArray[siblingParentIndex].childNodeIndexes)
    }

  }

  // http://ejohn.org/blog/comparing-document-position/
  _contains(a, b){
    return a.contains ?
      a != b && a.contains(b) :
      !!(a.compareDocumentPosition(b) & 16);
  }
}
