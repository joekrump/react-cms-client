export function capitalize(stringToCapitalize){
  if(stringToCapitalize !== undefined && stringToCapitalize.length > 0) {
    return stringToCapitalize[0].toUpperCase() + stringToCapitalize.slice(1);
  } else {
    return stringToCapitalize;
  }
  
}