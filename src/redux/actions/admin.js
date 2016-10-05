/**
 * @param  {string} mode [description]
 */
export function updateMode(mode){
  return {
    type: 'UPDATE_MODE',
    mode
  }
}

/**
 * @param  {boolean} hasChanges - value that helps determine context.
 */
export function updateIndexHasChanges(hasChanges){
  return {
    type: 'UPDATE_INDEX_HAS_CHANGES',
    hasChanges
  }
}

/**
 * @param  {string} pluralName [description]
 */
export function updateCurrentResourceName(pluralName){
  return {
    type: 'UPDATE_CURRENT_RESOURCE_NAME',
    pluralName: pluralName.toLowerCase()
  }
}

export function updateEditorData(newData) {
  return {
    type: 'UPDATE_ADMIN_EDITOR_DATA',
    newData
  }
}

export function deleteEditorData() {
  return {
    type: 'DELETE_ADMIN_EDITOR_DATA'
  }
}

export function uIndexItemDeleted(item_id) {
  return {
    type: 'U_INDEX_ITEM_DELETED',
    item_id
  } 
}