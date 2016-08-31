export {widgetParamHandler, defineFileHandler, namePattern, nameTitle, defParamsClick, selectedNodeAttr} from "./params"

export const onResize = require("prosemirror/node_modules/element-resize-event/index.js")	 

export function defParser(type,tag,cls) {
	type.register("parseDOM", tag, {
		parse(dom, state) {
			if (!dom.classList.contains(cls)) return false
		    let attrs = Object.create(null)
		    for (let name in this.attrs) attrs[name] = dom.getAttribute(name)
			state.wrapIn(dom,this,attrs)
		}
	})	
}

export function getID() {
	return Math.floor(Math.random() * 0xffffffff)
}

export function addDropListeners(pm) {
	pm.content.addEventListener("drop", e => {
		return false
		let html = e.dataTransfer.getData("text/html")
		console.log(html)
		e.preventDefault()
		return true
	})
}

/*import {InputRule} from "prosemirror/dist/inputrules"
let urlex = /((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/
LinkMark.register("autoInput","startLink", new InputRule(urlex," ",
	function(pm, match, pos) {
		let url = match[0]
		console.log(url)
		pm.setMark(this,pos,{href: url, title: ""})
	}
))*/

