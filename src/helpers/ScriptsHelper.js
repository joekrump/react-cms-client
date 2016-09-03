export function loadScript(filepath, onLoadCallback){
    var fileref=document.createElement('script')
    
    if(onLoadCallback) {
        fileref.onload = function() {
            onLoadCallback();
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