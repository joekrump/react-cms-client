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

const helper = new TreeHelper(dummyTreeData);

test('nodeArray is correct length', () => {
  // Note: an artificial root node is added in, therefore the
  // length should be one more than the number of items provided.
  expect(helper.nodeArray.length).toBe(17)
})

test('lookupArray is correct length', () => {
  // Note: an artificial root node is added in, therefore the
  // length should be one more than the number of items provided.
  expect(helper.lookupArray.length).toBe(17)
})

test('Move first item into last position', () => {
  helper.updateOrder(1, null)
  expect(helper.lookupArray[helper.nodeArray.length - 1]).toBe(1)
})

