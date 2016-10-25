import TreeHelper from '../src/helpers/TreeHelper';

const dummyTreeData = [
  { "id": 1, "children": [] },
  { "id": 2, "children": [] },
  { "id": 3, "children": [] },
  { "id": 4, "children": [] },
  { "id": 5, "children": [] },
  { "id": 6, "children": [] },
  { "id": 7, "children": [] },
  { "id": 8, "children": [] },
  { "id": 9, "children": [] },
  { "id": 10, "children": [] },
  { "id": 11, "children": [] },
  { "id": 12, "children": [] },
  { "id": 13, "children": [] },
  { "id": 14, "children": [] },
  { "id": 15, "children": [] },
  { "id": 16, "children": [] }
];


it('richNodeArray is correct length', () => {
  let helper = new TreeHelper(dummyTreeData);
  // Note: an artificial root node is added in, therefore the
  // length should be one more than the number of items provided.
  expect(helper.richNodeArray.length).toEqual(17)
})

test('lookupArray is correct length', () => {
  let helper = new TreeHelper(dummyTreeData);
  // Note: an artificial root node is added in, therefore the
  // length should be one more than the number of items provided.
  expect(helper.lookupArray.length).toBe(17)
})

test('Moves first item to last', () => {
  let helper = new TreeHelper(dummyTreeData);

  helper.updateTree(1, null); // move item with id of 1 to the end
  (
    expect(
      helper.lookupArray[helper.richNodeArray.length - 1], 
      helper.lookupArray[helper.richNodeArray.length - 2]
    ).toBe(1,16)
  )
})

test('Moves last item to first', () => {
  let helper = new TreeHelper(dummyTreeData);

  helper.updateTree((helper.richNodeArray.length - 1), 1);
  expect(helper.lookupArray[1]).toBe(16)
})

test('Moves first to last and then last to first', () => {
  let helper = new TreeHelper(dummyTreeData);
  helper.updateTree(1, null);
  helper.updateTree(1, 2);
  expect(helper.lookupArray[1]).toBe(1)
})

it('Updates parentIndex', () => {
  let helper = new TreeHelper(dummyTreeData);
  helper.updateTree(1, null, 2); // 1 nests under 2
  let newIndex = helper.lookupArray.indexOf(1);
  let indexOfParent = helper.lookupArray.indexOf(2);

  expect(
    helper.richNodeArray[newIndex].parentIndex,
    helper.richNodeArray[indexOfParent].childIndexes[0],
    helper.richNodeArray[indexOfParent].childIndexes.length
  ).toBe(indexOfParent, newIndex, 1)
})

it('Keeps correct reference to parent', () => {
  let helper = new TreeHelper(dummyTreeData);
  helper.updateTree(1, null, 2); // 1 nests under 2
  
  helper.updateTree(4, 2); // move 4 above 2
  // check to see if the parentIndex of item with id 1 is correctly updated.
  //
  let newIndex = helper.lookupArray.indexOf(1);
  let newParentIndex = helper.lookupArray.indexOf(2);

  expect(helper.richNodeArray[newIndex].parentIndex).toBe(newParentIndex);
})

it('Allows multiple items to be nested', () => {
  let helper = new TreeHelper(dummyTreeData);
  helper.updateTree(1, null, 2); // 1 nests under 2
  helper.updateTree(5, 1); // nest 5 under 2 and above 1

  let parentIndex = helper.lookupArray.indexOf(2);
  let indexOfFive = helper.lookupArray.indexOf(5);
  let indexOfOne  = helper.lookupArray.indexOf(1);

  expect(helper.richNodeArray[parentIndex].childIndexes).toEqual([indexOfFive,indexOfOne]);
})

it('Allows multiple items to be nested with explicit parentId', () => {
  let helper = new TreeHelper(dummyTreeData);
  helper.updateTree(1, null, 2); // 1 nests under 2
  helper.updateTree(5, 1, 2); // nest 5 under 2 and above 1

  let parentIndex = helper.lookupArray.indexOf(2);
  let indexOfFive = helper.lookupArray.indexOf(5);
  let indexOfOne  = helper.lookupArray.indexOf(1);

  expect(helper.richNodeArray[parentIndex].childIndexes).toEqual([indexOfFive,indexOfOne]);
})

it('Allows parent item to move with children', () => {
  let helper = new TreeHelper(dummyTreeData);
  helper.updateTree(1, null, 2); // 1 nests under 2
  helper.updateTree(16, 1); // nest 16 under 2 and above 1
  
  // helper.richNodeArray should look like this: 
  // [ { item_id: -1, childIndexes: [ 1, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17 ] },
  // { item_id: 2, childIndexes: [ 2, 3 ], parentIndex: 0 },
  // { item_id: 16, childIndexes: [], parentIndex: 1 },
  // { item_id: 1, childIndexes: [], parentIndex: 1 },
  // { item_id: 3, childIndexes: [], parentIndex: 0 },
  // { item_id: 4, childIndexes: [], parentIndex: 0 },
  // { item_id: 5, childIndexes: [], parentIndex: 0 },
  // { item_id: 6, childIndexes: [], parentIndex: 0 },
  // { item_id: 7, childIndexes: [], parentIndex: 0 },
  // { item_id: 8, childIndexes: [], parentIndex: 0 },
  // { item_id: 9, childIndexes: [], parentIndex: 0 },
  // { item_id: 10, childIndexes: [], parentIndex: 0 },
  // { item_id: 11, childIndexes: [], parentIndex: 0 },
  // { item_id: 12, childIndexes: [], parentIndex: 0 },
  // { item_id: 13, childIndexes: [], parentIndex: 0 },
  // { item_id: 14, childIndexes: [], parentIndex: 0 },
  // { item_id: 15, childIndexes: [], parentIndex: 0 } ]
  
  // now move 2 (and its children) in front of 10
  helper.updateTree(2, 10);

  // helper.richNodeArray should look like this: 
  // [ { item_id: -1, childIndexes: [ 1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13, 14, 15, 16, 17 ] },
  //   { item_id: 3, childIndexes: [], parentIndex: 0 },
  //   { item_id: 4, childIndexes: [], parentIndex: 0 },
  //   { item_id: 5, childIndexes: [], parentIndex: 0 },
  //   { item_id: 6, childIndexes: [], parentIndex: 0 },
  //   { item_id: 7, childIndexes: [], parentIndex: 0 },
  //   { item_id: 8, childIndexes: [], parentIndex: 0 },
  //   { item_id: 9, childIndexes: [], parentIndex: 0 },
  //   { item_id: 2, childIndexes: [ 9, 10 ], parentIndex: 0 },
  //   { item_id: 16, childIndexes: [], parentIndex: 8 },
  //   { item_id: 1, childIndexes: [], parentIndex: 8 },
  //   { item_id: 10, childIndexes: [], parentIndex: 0 },
  //   { item_id: 11, childIndexes: [], parentIndex: 0 },
  //   { item_id: 12, childIndexes: [], parentIndex: 0 },
  //   { item_id: 13, childIndexes: [], parentIndex: 0 },
  //   { item_id: 14, childIndexes: [], parentIndex: 0 },
  //   { item_id: 15, childIndexes: [], parentIndex: 0 } ]
  
  let parentIndex = helper.lookupArray.indexOf(2);
  let indexOfSixteen = helper.lookupArray.indexOf(16);
  let indexOfOne     = helper.lookupArray.indexOf(1);

  expect(parentIndex, helper.richNodeArray[parentIndex].childIndexes).toEqual(8,[indexOfSixteen,indexOfOne]);
})

it('Can nest multiple depths in sequence', () => {
  let helper = new TreeHelper(dummyTreeData);
  helper.updateTree(1, null, 2); // 1 nests under 2
  helper.updateTree(16, 1); // nest 16 under 2 and above 1
  // nest 4 under 16
  helper.updateTree(4, null, 16);
  let indexOfSixteen = helper.lookupArray.indexOf(16);
  let indexOfFour = helper.lookupArray.indexOf(4);

  expect((indexOfSixteen + 1), helper.richNodeArray[indexOfSixteen].childIndexes).toEqual(indexOfFour, [indexOfFour])
})

it('Can move multi-depth array', () => {
  let helper = new TreeHelper(dummyTreeData);
  helper.updateTree(4, null, 2); // 4 nests under 2
  helper.updateTree(7, 4); // nest 7 under 2 and above 4

  helper.updateTree(5, null, 16); // 5 nests under 16
  helper.updateTree(3, 5); // nest 3 under 16 and above 5

  helper.updateTree(2, 5, 16) // move tree with root of item_id 2 in between 3 and 5
  let indexOfSixteen = helper.lookupArray.indexOf(16);

  expect(helper.lookupArray.splice(indexOfSixteen + 1, 5)).toEqual([3, 2, 7, 4, 5]);
})

it('Child can switch parents', () => {
  let helper = new TreeHelper(dummyTreeData);
  helper.updateTree(4, null, 2); // 4 nests under 2
  helper.updateTree(7, 4); // nest 7 under 2 and above 4
  helper.updateTree(4, null, 12) // now nest 4 under 12
  let indexOfTwelve = helper.lookupArray.indexOf(12);
  let indexOfFour = helper.lookupArray.indexOf(4);

  expect(indexOfFour, helper.richNodeArray[indexOfTwelve].childIndexes).toEqual(12, [indexOfFour])
})

it('Has linear order remain after child removal', () => {
  let helper = new TreeHelper(dummyTreeData);
  helper.updateTree(4, null, 2); // 4 nests under 2
  helper.updateTree(7, 4); // nest 7 under 2 and above 4
  helper.updateTree(4, null, 12) // now nest 4 under 12
  let indexOfTwelve = helper.lookupArray.indexOf(12);
  expect(helper.lookupArray).toEqual([-1, 1, 2, 7, 3, 5, 6, 8, 9, 10, 11, 12, 4, 13, 14, 15, 16])
})

fit('If inserting an item after child of a sibling works as expected.', () => {
  let helper = new TreeHelper(dummyTreeData);
  helper.updateTree(2, null, 1); // 4 nests under 2
  helper.updateTree(3, null, 2); // nest 7 under 2 and above 4
  helper.updateTree(4, null, 1) // now nest 4 under 12
  expect(helper.lookupArray.slice(1, 5)).toEqual([1, 2, 3, 4])
})