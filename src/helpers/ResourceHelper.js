import { APIClient } from "../http/requests";
import TreeHelper from "./TreeHelper";

export function getIndexItems(resourceNamePlural, dispatch){
  
  let client = new APIClient(dispatch);
  
  return client.get(resourceNamePlural).then((res) => {
    let flatNodes = [];
    if(res.statusCode === 200) {
      // create a tree structure from the array of data returned.
      let treeHelper = new TreeHelper(res.body.data)
      
      flatNodes = treeHelper.flatNodes;
    }
    return flatNodes;
  }).catch((res) => {
    console.error("ERROR", res);
  });
}

export function getResourceData(dispatch, resourceURL, resolve, reject) {
  const client = new APIClient(dispatch)

  client.get(resourceURL)
  .then((res) => resolve(res), (res) => reject(res))
  .catch((res) => {
    console.error("Error getting resource data: ", res);
  })
}

export function putResourceData(dispatch, url, data) {
  const client = new APIClient(dispatch)

  return client.put(url, true, data)
    .then((res) => {
      return -1;
    }, (res) => {
      return 0;
    }).catch((res) => {
      return 1;
    }
  );
}

/**
 * A helper with methods related to resources
 */

export function pluralizeName(wordToPluralize){
  if(wordToPluralize === undefined || wordToPluralize.length === 0) {
    return ""
  } else {
    wordToPluralize = wordToPluralize.toLowerCase();
    switch(wordToPluralize){
      case "user": 
        return "users";
      case "book": 
        return "books";
      case "permission": 
        return "permissions";
      case "role": 
        return "roles";
      case "page": 
        return "pages";
      default: {
        if(wordToPluralize[wordToPluralize.length - 1] === "y"){
          return `${wordToPluralize.slice(0, -1)}ies`;
        } else {
          return `${wordToPluralize}s`;
        }
      }
    }
  }
}

export function singularizeName(wordToSingularize){
  if(wordToSingularize === undefined || wordToSingularize.length === 0) {
    return ""
  } else {
    wordToSingularize = wordToSingularize.toLowerCase();
    switch(wordToSingularize){
      case "users":
        return "user" 
      case "books":
        return "book";
      case "permissions":
        return "permission";
      case "roles":
        return "role";
      case "pages":
        return "page";
      default: {
        var lastThreeChars = wordToSingularize.slice(-3).toLowerCase();

        if(lastThreeChars === "ies") {
          return wordToSingularize.slice(0, -3) + "y"
        } else {
          return wordToSingularize.slice(0, -1)
        }
      }
    }
  }
}
