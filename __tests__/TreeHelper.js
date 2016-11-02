import TreeHelper, {getNodeFromId} from '../src/helpers/TreeHelper';

const dummyTreeData = [
  {
    "id": 1,
    "parent_id": null,
    "deletable": 1,
    "previewPath": "/A",
    "depth": 0,
    "draft": 0,
    "primary": "A",
    "secondary": "/A",
    "children": [
      {
        "id": 2,
        "parent_id": 1,
        "deletable": 1,
        "previewPath": "/A/B",
        "depth": 0,
        "draft": 0,
        "primary": "B",
        "secondary": "/A/B",
        "children": [],
        "child_ids": [],
        "unmovable": false,
        "denyNested": false
      },
      {
        "id": 3,
        "parent_id": 1,
        "deletable": 1,
        "previewPath": "/A/C",
        "depth": 0,
        "draft": 0,
        "primary": "C",
        "secondary": "/A/C",
        "children": [
          {
            "id": 4,
            "parent_id": 3,
            "deletable": 1,
            "previewPath": "/A/C/D",
            "depth": 0,
            "draft": 0,
            "primary": "D",
            "secondary": "/A/C/D",
            "children": [],
            "child_ids": [],
            "unmovable": false,
            "denyNested": false
          }
        ],
        "child_ids": [
          4
        ],
        "unmovable": false,
        "denyNested": false
      }
    ],
    "child_ids": [
      2,
      3
    ],
    "unmovable": false,
    "denyNested": false
  },
  {
    "id": 5,
    "parent_id": null,
    "deletable": 0,
    "previewPath": "/E",
    "depth": 0,
    "draft": 0,
    "primary": "E",
    "secondary": "/E",
    "children": [],
    "child_ids": [],
    "unmovable": true,
    "denyNested": true
  },
  {
    "id": 6,
    "parent_id": null,
    "deletable": 0,
    "previewPath": "/F",
    "depth": 0,
    "draft": 0,
    "primary": "F",
    "secondary": "/F",
    "children": [],
    "child_ids": [],
    "unmovable": false,
    "denyNested": false
  }
]

const helper = new TreeHelper(dummyTreeData);

it('correct number of items in flatNodes', () => {
  expect(helper.flatNodes.length).toEqual(7)
})

test('Moves first item to last', () => {
  helper.updateTree(1, null);
  let movedNode = getNodeFromId(1, helper.flatNodes);
  expect(helper.flatNodes[0].child_ids, movedNode.parent_id).toEqual([5, 6, 1], null)
})


test('Moves last item to first', () => {
  helper.updateTree(1, 5);
  let movedNode = getNodeFromId(1, helper.flatNodes);
  expect(helper.flatNodes[0].child_ids, movedNode.parent_id).toEqual([1, 5, 6], null)
})

test('Moves first to last and then last to first', () => {
  helper.updateTree(1, null);
  helper.updateTree(1, 5);
  expect(helper.flatNodes[0].child_ids).toEqual([1, 5, 6]) // same as starting state.
})

it('Allows a single item to be nested under a parent', () => {
  helper.updateTree(6, null, 5); // nest F under E
  let nestedNode = getNodeFromId(6, helper.flatNodes);
  let parentNode = getNodeFromId(5, helper.flatNodes);

  expect(
    [parentNode.child_ids, 
    nestedNode.parent_id, 
    helper.flatNodes[0].child_ids, 
    helper.flatNodes[0].children.length]
  ).toEqual([[6], 5, [1, 5], 2])
})

// it('Keeps correct reference to parent', () => {
//   let helper = new TreeHelper(dummyTreeData);
//   helper.updateTree(1, null, 2); // 1 nests under 2
  
//   helper.updateTree(4, 2); // move 4 above 2
//   // check to see if the parentIndex of item with id 1 is correctly updated.
//   //
//   let newIndex = helper.lookupArray.indexOf(1);
//   let newParentIndex = helper.lookupArray.indexOf(2);

//   expect(helper.richNodeArray[newIndex].parentIndex).toBe(newParentIndex);
// })

// it('Allows multiple items to be nested', () => {
//   let helper = new TreeHelper(dummyTreeData);
//   helper.updateTree(1, null, 2); // 1 nests under 2
//   helper.updateTree(5, 1); // nest 5 under 2 and above 1

//   let parentIndex = helper.lookupArray.indexOf(2);
//   let indexOfFive = helper.lookupArray.indexOf(5);
//   let indexOfOne  = helper.lookupArray.indexOf(1);

//   expect(helper.richNodeArray[parentIndex].childIndexes).toEqual([indexOfFive,indexOfOne]);
// })

// it('Allows multiple items to be nested with explicit parentId', () => {
//   let helper = new TreeHelper(dummyTreeData);
//   helper.updateTree(1, null, 2); // 1 nests under 2
//   helper.updateTree(5, 1, 2); // nest 5 under 2 and above 1

//   let parentIndex = helper.lookupArray.indexOf(2);
//   let indexOfFive = helper.lookupArray.indexOf(5);
//   let indexOfOne  = helper.lookupArray.indexOf(1);

//   expect(helper.richNodeArray[parentIndex].childIndexes).toEqual([indexOfFive,indexOfOne]);
// })

// it('Allows parent item to move with children', () => {
//   let helper = new TreeHelper(dummyTreeData);
//   helper.updateTree(1, null, 2); // 1 nests under 2
//   helper.updateTree(16, 1); // nest 16 under 2 and above 1
  
//   // helper.richNodeArray should look like this: 
//   // [ { item_id: -1, childIndexes: [ 1, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17 ] },
//   // { item_id: 2, childIndexes: [ 2, 3 ], parentIndex: 0 },
//   // { item_id: 16, childIndexes: [], parentIndex: 1 },
//   // { item_id: 1, childIndexes: [], parentIndex: 1 },
//   // { item_id: 3, childIndexes: [], parentIndex: 0 },
//   // { item_id: 4, childIndexes: [], parentIndex: 0 },
//   // { item_id: 5, childIndexes: [], parentIndex: 0 },
//   // { item_id: 6, childIndexes: [], parentIndex: 0 },
//   // { item_id: 7, childIndexes: [], parentIndex: 0 },
//   // { item_id: 8, childIndexes: [], parentIndex: 0 },
//   // { item_id: 9, childIndexes: [], parentIndex: 0 },
//   // { item_id: 10, childIndexes: [], parentIndex: 0 },
//   // { item_id: 11, childIndexes: [], parentIndex: 0 },
//   // { item_id: 12, childIndexes: [], parentIndex: 0 },
//   // { item_id: 13, childIndexes: [], parentIndex: 0 },
//   // { item_id: 14, childIndexes: [], parentIndex: 0 },
//   // { item_id: 15, childIndexes: [], parentIndex: 0 } ]
  
//   // now move 2 (and its children) in front of 10
//   helper.updateTree(2, 10);

//   // helper.richNodeArray should look like this: 
//   // [ { item_id: -1, childIndexes: [ 1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13, 14, 15, 16, 17 ] },
//   //   { item_id: 3, childIndexes: [], parentIndex: 0 },
//   //   { item_id: 4, childIndexes: [], parentIndex: 0 },
//   //   { item_id: 5, childIndexes: [], parentIndex: 0 },
//   //   { item_id: 6, childIndexes: [], parentIndex: 0 },
//   //   { item_id: 7, childIndexes: [], parentIndex: 0 },
//   //   { item_id: 8, childIndexes: [], parentIndex: 0 },
//   //   { item_id: 9, childIndexes: [], parentIndex: 0 },
//   //   { item_id: 2, childIndexes: [ 9, 10 ], parentIndex: 0 },
//   //   { item_id: 16, childIndexes: [], parentIndex: 8 },
//   //   { item_id: 1, childIndexes: [], parentIndex: 8 },
//   //   { item_id: 10, childIndexes: [], parentIndex: 0 },
//   //   { item_id: 11, childIndexes: [], parentIndex: 0 },
//   //   { item_id: 12, childIndexes: [], parentIndex: 0 },
//   //   { item_id: 13, childIndexes: [], parentIndex: 0 },
//   //   { item_id: 14, childIndexes: [], parentIndex: 0 },
//   //   { item_id: 15, childIndexes: [], parentIndex: 0 } ]
  
//   let parentIndex = helper.lookupArray.indexOf(2);
//   let indexOfSixteen = helper.lookupArray.indexOf(16);
//   let indexOfOne     = helper.lookupArray.indexOf(1);

//   expect(parentIndex, helper.richNodeArray[parentIndex].childIndexes).toEqual(8,[indexOfSixteen,indexOfOne]);
// })

// it('Can nest multiple depths in sequence', () => {
//   let helper = new TreeHelper(dummyTreeData);
//   helper.updateTree(1, null, 2); // 1 nests under 2
//   helper.updateTree(16, 1); // nest 16 under 2 and above 1
//   // nest 4 under 16
//   helper.updateTree(4, null, 16);
//   let indexOfSixteen = helper.lookupArray.indexOf(16);
//   let indexOfFour = helper.lookupArray.indexOf(4);

//   expect((indexOfSixteen + 1), helper.richNodeArray[indexOfSixteen].childIndexes).toEqual(indexOfFour, [indexOfFour])
// })

// it('Can move multi-depth array', () => {
//   let helper = new TreeHelper(dummyTreeData);
//   helper.updateTree(4, null, 2); // 4 nests under 2
//   helper.updateTree(7, 4); // nest 7 under 2 and above 4

//   helper.updateTree(5, null, 16); // 5 nests under 16
//   helper.updateTree(3, 5); // nest 3 under 16 and above 5


//   helper.updateTree(2, 5, 16) // move tree with root of item_id 2 in between 3 and 5
//   let indexOfSixteen = helper.lookupArray.indexOf(16);


//   expect(helper.lookupArray.splice(indexOfSixteen + 1, 5)).toEqual([3, 2, 7, 4, 5]);
// })

// it('Child can switch parents', () => {
//   let helper = new TreeHelper(dummyTreeData);
//   helper.updateTree(4, null, 2); // 4 nests under 2
//   helper.updateTree(7, 4); // nest 7 under 2 and above 4
//   helper.updateTree(4, null, 12) // now nest 4 under 12
//   let indexOfTwelve = helper.lookupArray.indexOf(12);
//   let indexOfFour = helper.lookupArray.indexOf(4);

//   expect(indexOfFour, helper.richNodeArray[indexOfTwelve].childIndexes).toEqual(12, [indexOfFour])
// })

// it('Has linear order remain after child removal', () => {
//   let helper = new TreeHelper(dummyTreeData);
//   helper.updateTree(4, null, 2); // 4 nests under 2
//   helper.updateTree(7, 4); // nest 7 under 2 and above 4
//   helper.updateTree(4, null, 12) // now nest 4 under 12
//   let indexOfTwelve = helper.lookupArray.indexOf(12);
//   expect(helper.lookupArray).toEqual([-1, 1, 2, 7, 3, 5, 6, 8, 9, 10, 11, 12, 4, 13, 14, 15, 16])
// })

// fit('If inserting an item after child of a sibling works as expected.', () => {
//   let helper = new TreeHelper(dummyTreeData);
//   helper.updateTree(2, null, 1); // 4 nests under 2
//   helper.updateTree(3, null, 2); // nest 7 under 2 and above 4
//   helper.updateTree(4, null, 1) // now nest 4 under 12
//   expect(helper.lookupArray.slice(1, 5)).toEqual([1, 2, 3, 4])
// })