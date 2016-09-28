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
]



test('nodeArray is correct length', () => {
  let helper = new TreeHelper(dummyTreeData);
  // Note: an artificial root node is added in, therefore the
  // length should be one more than the number of items provided.
  expect(helper.nodeArray.length).toBe(17)
})

test('lookupArray is correct length', () => {
  let helper = new TreeHelper(dummyTreeData);
  // Note: an artificial root node is added in, therefore the
  // length should be one more than the number of items provided.
  expect(helper.lookupArray.length).toBe(17)
})

test('Move first item to last', () => {
  let helper = new TreeHelper(dummyTreeData);

  helper.updateOrder(1, null);
  (
    expect(helper.lookupArray[helper.nodeArray.length - 1]).toBe(1) &&
    expect(helper.lookupArray[helper.nodeArray.length - 2]).toBe(16)
  )
})

test('Move last item to first', () => {
  let helper = new TreeHelper(dummyTreeData);

  helper.updateOrder((helper.nodeArray.length - 1), 1);
  expect(helper.lookupArray[1]).toBe(16)
})

test('Move first to last and then last to first', () => {
  let helper = new TreeHelper(dummyTreeData);
  helper.updateOrder(1, null);
  helper.updateOrder(1, 2);
  expect(helper.lookupArray[1]).toBe(1)
})

it('Should have updated parentIndex', () => {
  let helper = new TreeHelper(dummyTreeData);
  helper.updateOrder(1, null, 2); // 1 nests under 2
  let newIndex = helper.lookupArray.indexOf(1);
  let indexOfParent = helper.lookupArray.indexOf(2);

  expect(helper.nodeArray[newIndex].parentIndex).toBe(2)
  && expect(helper.nodeArray[indexOfParent].childNodeIndexes[0]).toBe(newIndex)
  && expect(helper.nodeArray[indexOfParent].childNodeIndexes.length).toBe(1)

})

