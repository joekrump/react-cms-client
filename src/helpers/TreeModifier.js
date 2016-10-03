export default class TreeModifier {
  constructor(existingTree) {

    // An array to hold objects representing nodes in a tree.
    this.richNodeArray          = existingTree;
    // will contain only item_ids of items stored in richNodeArray for quick lookup.
    this.lookupArray            = []; 
    this.decrementParentIndexes = this.decrementParentIndexes.bind(this);
    this.decrementChildIndexes  = this.decrementChildIndexes.bind(this);
    this.removeSingleItem       = this.removeSingleItem.bind(this);
    this.getIndexFromId         = this.getIndexFromId.bind(this);
    this.getIdFromIndex         = this.getIdFromIndex.bind(this);
    this.addChildToParent       = this.addChildToParent.bind(this);
    this.setChildDepth          = this.setChildDepth.bind(this);
    this.updateSecondaryText    = this.updateSecondaryText.bind(this);
    this.removeFromTreeByItemId = this.removeFromTreeByItemId.bind(this);

    if(existingTree) {
      existingTree.forEach((node) => {
        this.lookupArray.push(node.item_id);
      })
    } 
  }

  removeFromTreeByItemId(item_id) {
    // Find the instance of the node that has a item_id that matches the one provided.
    // 
    let nodeIndex = this.getIndexFromId(item_id);
    // remove it from the tree
    // 
    let item = this.richNodeArray[nodeIndex];
    let parentNode = this.richNodeArray[item.parentIndex]

    // if not the last child then it has a sibling
    //
    let itemData = this.removeSingleItem(nodeIndex, item);

    itemData.item.childIndexes.forEach((index) => {
      this.addChildToParent(this.richNodeArray[index], index, nodeIndex);
    })
    let childIndex = parentNode.childIndexes.indexOf(nodeIndex);
    parentNode.childIndexes.splice(childIndex, 1); // remove the item from its parent's list of children.
  }

  /**
   * Slice an item from both the lookupArray and richNodeArray at a specific 
   * index.
   * @param  {int} index - The index at which the item is to be removed.
   * @return {Object}    - A minimal representation of the the item that was removed
   *                       from the richNodeArray.
   */
  removeSingleItem(index, item) {

    // get the number of items to remove. so that parents and children are all move together.
    let richItems  = this.richNodeArray.splice(index, 1);
    let idsRemoved = this.lookupArray.splice(index, 1);
    let startingIndex = index + (idsRemoved.length - 1);

    // update the childIndexes references and parentIndex references
    this.decrementParentIndexes(startingIndex, 1);
    this.decrementChildIndexes(startingIndex, 1);

    // Adjust indexes of items in the array of items being moved.
    richItems = this.decrementParentIndexes(startingIndex, 1, richItems);
    richItems = this.decrementChildIndexes(startingIndex, 1, richItems);

    return {item: richItems[0], id: idsRemoved[0]};
  }

  setChildDepth(moveItemRoot, parentNode) {
    // update depth to be one more than that of its parent
    moveItemRoot.depth = parentNode.depth + 1;
  }

  updateSecondaryText(moveItemRoot, parentNode) {
    let parentSecondary = parentNode.node.secondary ? 
      parentNode.node.secondary : '';
    let slashIndex = moveItemRoot.node.secondary.lastIndexOf('/');
    let originalPath = moveItemRoot.node.secondary.substr(slashIndex);
    moveItemRoot.node.secondary = `${parentSecondary}${originalPath}`

    this.setChildDepth(moveItemRoot, parentNode);

    if(moveItemRoot.childIndexes.length > 0) {
      moveItemRoot.childIndexes.forEach((childIndex) => {
        this.updateSecondaryText(this.richNodeArray[childIndex], moveItemRoot);
        this.increaseChildDepth(this.richNodeArray[childIndex], moveItemRoot);
      })
    }
  }

  addChildToParent(moveItemRoot, index, nextIndex){

    let parentNode = this.richNodeArray[moveItemRoot.parentIndex];
    
    if(moveItemRoot.node.children && moveItemRoot.node.secondary) {
      // update secondary text
      this.updateSecondaryText(moveItemRoot, parentNode);
    } else {
      this.setChildDepth(moveItemRoot, parentNode);
    }

    if(nextIndex === -1 && moveItemRoot.parentIndex === 0){
      parentNode.childIndexes.push(index);
      // parentNode.node.children.push(moveItemRoot.node);
    } else if(nextIndex === -1) {
      parentNode.childIndexes.push(index);
      // parentNode.node.children.push(moveItemRoot.node);
    } else {
      // otherwise splice the item into the array at the index where the
      // nextIndex sibling previously was.
      let childIndexes = parentNode.childIndexes;
      let siblingIndex = childIndexes.indexOf(nextIndex);
      parentNode.childIndexes.splice(siblingIndex, 0, index);
      // parentNode.node.children.splice(siblingIndex, 0, moveItemRoot.node);
    }
  }

  /**
   * Updates child item parentIndex values for items that have parentIndex values
   * that are greater than the startingIndex value provided.
   * @param  {int} startingIndex - The index value to compare parentIndexes against.
   * @param  {boolean} increase  - Determines whether parentIndexes that are > than
   *                               startingIndex should be increased or decreased.
   * @return undefined
   */
  decrementParentIndexes(startingIndex, amt, arrayofItems = this.richNodeArray){
    // start from index 1 because the root at index 0 does not have a parent.
    for(let i = 1; i < arrayofItems.length; i++){
      if(arrayofItems[i].parentIndex > startingIndex){
        arrayofItems[i].parentIndex -= amt;
      }
    }
    return arrayofItems;
  }

  decrementChildIndexes(startingIndex, amt, arrayofItems = this.richNodeArray){
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
    return this.richNodeArray[index].item_id;
  }
}
