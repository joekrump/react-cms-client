export function capitalize(stringToCapitalize){
  if(stringToCapitalize !== undefined && stringToCapitalize.length > 0) {
    return stringToCapitalize[0].toUpperCase() + stringToCapitalize.slice(1);
  } else {
    return stringToCapitalize;
  }
}

export function slugify(text)
{
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')
}