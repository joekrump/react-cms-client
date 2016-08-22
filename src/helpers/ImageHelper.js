/**
 * Get the average color for an image or section of an image.
 * @param  {Image} imageElement  - The image object to get the sample from
 * @param  (optional) {Object} sampleSection - An object of the format {x1: int, y1: int, x2: int, y2: int} which denotes a rectangular area to sample from
 * @return {Object}               - An object containing the keys 'r', 'g' and 'b'.
 */
export function getEverageImageColor(imageElement, sampleSection = null){
  var blockSize = 5, // only visit every 5 pixels
      defaultRGB = {r:0,g:0,b:0}, // for non-supporting envs
      canvas = document.createElement('canvas'),
      context = canvas.getContext && canvas.getContext('2d'),
      data, width, height,
      i = -4,
      length,
      rgb = {r:0,g:0,b:0},
      count = 0;
      
  if (!context) {
      return defaultRGB;
  }

  try {
    if(sampleSection !== null){
      height = canvas.height = sampleSection.x2 - sampleSection.x1;
      width = canvas.width = sampleSection.y2 - sampleSection.y1;
      context.drawImage(
        imageElement, 
        sampleSection.x1, 
        sampleSection.y1, 
        height, 
        width, 
        0, 
        0, 
        height, 
        width
      );

    } else {
      height = canvas.height = imageElement.naturalHeight || imageElement.offsetHeight || imageElement.height;
      width = canvas.width = imageElement.naturalWidth || imageElement.offsetWidth || imageElement.width;
      context.drawImage(imageElement, 0, 0);
      
    }

    data = context.getImageData(0, 0, width, height);
  } catch(e) {
      /* security error, img on diff domain */
      alert('x');
      return defaultRGB;
  }
  
  length = data.data.length;
  
  while ( (i += blockSize * 4) < length ) {
      ++count;
      rgb.r += data.data[i];
      rgb.g += data.data[i+1];
      rgb.b += data.data[i+2];
  }
  
  // ~~ used to floor values
  rgb.r = ~~(rgb.r/count);
  rgb.g = ~~(rgb.g/count);
  rgb.b = ~~(rgb.b/count);
  
  return rgb;
}


export function isLight(imageElement, sampleSection){
  const rgb = getEverageImageColor(imageElement, sampleSection);
  var o = Math.round(((parseInt(rgb.r) * 299) + (parseInt(rgb.g) * 587) + (parseInt(rgb.b) * 114)) /1000);
  return o < 126;
}

export function isDark(imageElement, sampleSection){
  return !isLight(imageElement, sampleSection);
}

export function getIconColor(imageElement, sampleSection) {
  return isLight(imageElement, sampleSection) ? '#fff' : '#616161'
}