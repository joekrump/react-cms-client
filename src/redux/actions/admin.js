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