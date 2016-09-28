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
    this.getIndexFromId      = this.getIndexFromId.bind(this);
    
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
    console.log('startingIndex ', startingIndex);
    for(let i = 1; i < this.lookupArray.length; i++){
      if(this.nodeArray[i].parentIndex > startingIndex){
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

  getIndexFromId(id) {
    return ((id === null) ? -1 :this.lookupArray.indexOf(id));
  }
  /**
   * Updates the nodeArray
   * @param  {int} movedItemId Unique id of the item that is being moved.
   * @param  {int or null} nextItemId  Unique id of the item that below where the item was moved to.
   * @return undefined
   */
  _updateOrder(movedItemId, nextItemId, targetParentId) {
    // find the item in the lookup
    let originalIndex = this.getIndexFromId(movedItemId);
    // find the index of the next item in the lookup if one is provided, otherwise assign default of -1
    let nextItemIndex = this.getIndexFromId(nextItemId);
    
  }

  // http://ejohn.org/blog/comparing-document-position/
  _contains(a, b){
    return a.contains ?
      a != b && a.contains(b) :
      !!(a.compareDocumentPosition(b) & 16);
  }
}
