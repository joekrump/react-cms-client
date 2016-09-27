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
    this.update              = this._update.bind(this);
    
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
    this.lookupArray.push(treeNode.id);

    nodeItemIndex = this.nodeArray.length - 1;

    // Either initialize childNodeIndexs or push to existing array.
    this.nodeArray[parentIndex].childNodeIndexes.push(nodeItemIndex);
    
    return nodeItemIndex;
  }

  /**
   * Updates the nodeArray
   * @param  {int} nodeToUpdateId Unique id of the item that is being moved.
   * @param  {int or null} siblingNodeId  Unique id of the item that below where the other item was moved to.
   * @return undefined
   */
  _update(nodeToUpdateId, siblingNodeId) {
    // find the entry in nodeArray based on the id provided
    console.log('nodeToUpdateId: ', nodeToUpdateId)
    console.log('siblingNodeId: ', siblingNodeId)

    let indexOfUpdateNode = this.lookupArray.indexOf(nodeToUpdateId);
    console.log('indexOfUpdateNode: ', indexOfUpdateNode)
    let nodeToUpdate = this.nodeArray[indexOfUpdateNode];
    console.log('nodeToUpdate: ', nodeToUpdate)
    let childArrayIndex = this.nodeArray[nodeToUpdate.parentIndex].childNodeIndexes.indexOf(indexOfUpdateNode);
    console.log('childArrayIndex: ', childArrayIndex)
    let indexToMoveTo = -1;
    let siblingParentIndex = 0;
    let siblingChildIndex;

    // splice out the item reference
    console.log('REMOVING item from childNodeIndexes')
    console.log('Previous childNodeIndexes: ', this.nodeArray[nodeToUpdate.parentIndex].childNodeIndexes)
    this.nodeArray[nodeToUpdate.parentIndex].childNodeIndexes.splice(childArrayIndex, 1) // splice out the item
    console.log('After childNodeIndexes: ', this.nodeArray[nodeToUpdate.parentIndex].childNodeIndexes)

    if(siblingNodeId !== null) {
      let indexOfSiblingNode = this.lookupArray.indexOf(siblingNodeId);
      indexToMoveTo = indexOfSiblingNode;
      siblingParentIndex = this.nodeArray[indexOfSiblingNode].parentIndex;
      // Add the item to the siblings parent
      siblingChildIndex = this.nodeArray[siblingParentIndex].childNodeIndexes.indexOf(indexOfSiblingNode)
    }
    
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
      this.nodeArray.splice(indexToMoveTo, 0, itemsRemoved[0]);
      this.lookupArray.splice(indexToMoveTo, 0, itemsRemoved[0].model_id);
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
      // if the item does not have a sibling it must be the direct child of the root
      // so get the root (at index 0) and push to the end of its childNodeIndexes
      this.nodeArray[0].childNodeIndexes.push(indexToMoveTo);
      console.log('after: ', this.nodeArray[0].childNodeIndexes)
    }

  }
}
