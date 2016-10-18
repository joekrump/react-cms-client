import APIClient from '../http/requests';
import TreeHelper from './TreeHelper';

export function getIndexItems(resourceNamePlural, put){
  
  let client = new APIClient(put);
  let nodeArray = []

  nodeArray = client.get(resourceNamePlural).then((res) => {
    if(res.statusCode === 200) {
      // create a tree structure from the array of data returned.
      let treeHelper = new TreeHelper(res.body.data)
      
      nodeArray = treeHelper.richNodeArray;
      client.updateToken(res.header.authorization)
    }
    return nodeArray;
  }).catch((res) => {
    return [];
  });

  return nodeArray;
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