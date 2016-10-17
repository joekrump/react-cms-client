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

function setIndexItems(resourceNamePlural, store){

  let client = new APIClient(store);

  client.get(resourceNamePlural).then((res) => {

    if(res.statusCode !== 200) {
      updateResourceTree([], store) // Reset Items
      console.log('Bad Response: ', res)

    } else {
      // create a tree structure from the array of data returned.
      let treeHelper = new TreeHelper(res.body.data)

      updateResourceTree(treeHelper.richNodeArray, store);

      client.updateToken(res.header.authorization)
    }
  }).catch((res) => {
    updateResourceTree([], store) // Reset Items
  })
}

/**
 * Dispatch a redux UPDATE_TREE actoin
 * @param  {Array} nodeArray - the tree like data to set.
 * @param  {Object} store    - the redux store
 * @return {undefined}
 */
function updateResourceTree(nodeArray, store) {
  store.dispatch ({
    type: 'UPDATE_TREE',
    nodeArray
  })
}