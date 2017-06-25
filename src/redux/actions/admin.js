/**
 * @param  {string} mode [description]
 */
export function updateMode(mode) {
  return {
    type: "UPDATE_RESOURCE_MODE",
    mode,
  };
}

export function updateResource(pluralName, dataToUpdate, resourceId) {
  return {
    type: "UPDATE_RESOURCE_DATA",
    dataToUpdate,
    pluralName,
    resourceId,
  };
}

/**
 * @param  {boolean} hasChanges - value that helps determine context.
 */
export function updateIndexHasChanges(hasChanges) {
  return {
    type: "UPDATE_INDEX_HAS_CHANGES",
    hasChanges,
  };
}

/**
 * @param  {string} pluralName [description]
 */
export function updateAdminState(pluralName, pageType, resourceId) {
  return {
    type: "UPDATE_ADMIN_STATE",
    pluralName: pluralName.toLowerCase(),
    pageType,
    resourceId,
  };
}

export function updateEditorData(newData) {
  return {
    type: "UPDATE_ADMIN_EDITOR_DATA",
    newData,
  };
}

export function deleteEditorData() {
  return {
    type: "DELETE_ADMIN_EDITOR_DATA",
  };
}

export function updateLoadState(dataLoading) {
  return {
    type: "UPDATE_ADMIN_LOAD_STATE",
    dataLoading,
  };
}

export function uIndexItemDeleted(itemId) {
  return {
    type: "U_INDEX_ITEM_DELETED",
    itemId,
  };
}
