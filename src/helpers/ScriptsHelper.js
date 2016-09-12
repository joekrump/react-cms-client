export function loadScript(filepath, onLoadCallback, onErrorCallback){
    var fileref=document.createElement('script')
    
    if(onLoadCallback) {
        fileref.onload = function() {
            onLoadCallback();
        }
    }

    if(onErrorCallback) {
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

export function loadStylesheet(filepath, onLoadCallback) {
    var fileref=document.createElement("link")

    if(onLoadCallback) {
        fileref.onload = function() {
            onLoadCallback();
        }
    }
    
    fileref.setAttribute("rel", "stylesheet")
    fileref.setAttribute("type", "text/css")
    fileref.setAttribute("href", filepath)
    document.getElementsByTagName("head")[0].appendChild(fileref)
}