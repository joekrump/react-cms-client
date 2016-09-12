/**
 * Function to laod scripts dynamically from a specified source.
 * @param  {string} filepath     The path to the script that should be loaded.
 * @param  {function} (optional) onLoadCallback  A function that runs once the script has been loaded
 * @param  {function} (optional) onErrorCallback A function that runs if there was an error loading the script
 * @return {undefined}           No return from this function
 */
export function loadScript(filepath, onLoadCallback, onErrorCallback){
    var fileref=document.createElement('script')
    
    if(onLoadCallback) {
        fileref.onload = function() {
            onLoadCallback();
        }
    }

    if (onErrorCallback) {
        fileref.onerror = function() {
            onErrorCallback();
        }
    } else {
        fileref.onerror = function(error) {
            console.warn('Script failed to load: ', filepath);
            console.warn(error);
        }
    }
    
    fileref.setAttribute("type","text/javascript")
    fileref.setAttribute("src", filepath)
    document.getElementsByTagName("head")[0].appendChild(fileref)
}

/**
 * Function that load a stylesheet from a specified source
 * @param  {string} filepath          The path to the stylesheet that should be loaded
 * @param  {function} onLoadCallback  A function that should run if the stylesheet loads successfully
 * @param  {function} onErrorCallback A function that should run if the stylesheet fails to load
 * @return {undefined}                No return from this function.
 */
export function loadStylesheet(filepath, onLoadCallback, onErrorCallback) {
    var fileref=document.createElement("link")

    if(onLoadCallback) {
        fileref.onload = function() {
            onLoadCallback();
        }
    }

    if (onErrorCallback) {
        fileref.onerror = function() {
            onErrorCallback();
        }
    } else {
        fileref.onerror = function(error) {
            console.warn('Script failed to load: ', filepath);
            console.warn(error);
        }
    }
    
    fileref.setAttribute("rel", "stylesheet")
    fileref.setAttribute("type", "text/css")
    fileref.setAttribute("href", filepath)
    document.getElementsByTagName("head")[0].appendChild(fileref)
}