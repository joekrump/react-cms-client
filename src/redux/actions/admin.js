/**
 * [updateMode description]
 * @param  {string} mode [description]
 * @return {[type]}      [description]
 */
export function updateMode(mode){
  return {
    type: 'UPDATE_MODE',
    mode
  }
}

/**
 * @param  {boolean} status [description]
 * @return {[type]}        [description]
 */
export function updateIndexHasChanges(hasChanges){
  return {
    type: 'UPDATE_INDEX_HAS_CHANGES',
    hasChanges
  }
}

/**
 * @param  {string} status [description]
 * @return {[type]}        [description]
 */
export function updateCurrentResourceName(pluralName){
  return {
    type: 'UPDATE_CURRENT_RESOURCE_NAME',
    pluralName: pluralName.toLowerCase()
  }
}

export function updateEditorData(newData) {
  return {
    type: 'UPDATE_EDITOR_DATA',
    newData
  }
}

export function deleteEditorData() {
  return {
    type: 'DELETE_EDITOR_DATA'
  }
}

export function uIndexItemDeleted(item_id) {
  return {
    type: 'U_INDEX_ITEM_DELETED',
    item_id
  } 
}