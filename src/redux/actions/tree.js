export function updateTree(flatNodes) {
  return {
    type: "UPDATE_TREE",
    flatNodes,
  };
}

export function updateTreeState(updatedTree) {
  return {
    type: "UPDATE_TREE_STATE",
    updatedTree,
  };
}

export function updateTreeResourceAttributes(pluralName, dataToUpdate, resourceId) {
  return {
    type: "UPDATE_RESOURCE_ATTRIBUTES_IN_TREE",
    dataToUpdate,
    pluralName,
    resourceId,
  };
}
