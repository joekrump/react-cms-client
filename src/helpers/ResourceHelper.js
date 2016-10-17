import APIClient from '../http/requests';
import TreeHelper from './TreeHelper';


function setIndexItems(resourceNamePlural, put){
  // put app in data loading state.
  put(updateDataLoadingState(true));
  
  let client = new APIClient(put);

  client.get(resourceNamePlural).then((res) => {

    if(res.statusCode !== 200) {
      put(updateDataLoadingState(false));
      put(updateResourceTree([])) // Reset Items
    } else {
      // create a tree structure from the array of data returned.
      let treeHelper = new TreeHelper(res.body.data)
      put(updateDataLoadingState(false));
      put(updateResourceTree(treeHelper.richNodeArray));

      client.updateToken(res.header.authorization)
    }
  }).catch((res) => {
    put(updateDataLoadingState(false));
    put(updateResourceTree([])) // Reset Items
  })
}

/**
 * Dispatch a redux UPDATE_TREE action
 * @param  {Array} nodeArray - the tree like data to set.
 * @param  {function} dispatch
 * @return {undefined}
 */
function updateResourceTree(nodeArray) {
  return {
    type: 'UPDATE_TREE',
    nodeArray
  }
}

function updateDataLoadingState(dataLoading) {
  return {
    type: 'UPDATE_ADMIN_LOAD_STATE',
    dataLoading
  }
}

/**
 * A helper with methods related to resources
 */

export function pluralizeName(wordToPluralize){
  if(wordToPluralize === undefined || wordToPluralize.length === 0) {
    return ''
  } else {
    wordToPluralize = wordToPluralize.toLowerCase();
    switch(wordToPluralize){
      case 'user': 
        return 'users';
      case 'book': 
        return 'books';
      case 'permission': 
        return 'permissions';
      case 'role': 
        return 'roles';
      case 'page': 
        return 'pages';
      default: {
        if(wordToPluralize[wordToPluralize.length - 1] === 'y'){
          return wordToPluralize.slice(0, -1) + 'ies'
        } else {
          return wordToPluralize + 's'
        }
      }
    }
  }
}

export function singularizeName(wordToSingularize){
  if(wordToSingularize === undefined || wordToSingularize.length === 0) {
    return ''
  } else {
    wordToSingularize = wordToSingularize.toLowerCase();
    switch(wordToSingularize){
      case 'users':
        return 'user' 
      case 'books':
        return 'book';
      case 'permissions':
        return 'permission';
      case 'roles':
        return 'role';
      case 'pages':
        return 'page';
      default: {
        var lastThreeChars = wordToSingularize.slice(-3).toLowerCase();

        if(lastThreeChars === 'ies') {
          return wordToSingularize.slice(0, -3) + 'y'
        } else {
          return wordToSingularize.slice(0, -1)
        }
      }
    }
  }
}