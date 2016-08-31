import {Block, Attribute} from "prosemirror/dist/model"
import {elt, insertCSS} from "prosemirror/dist/util/dom"
import {Input} from "./input"
import {defParser, defParamsClick, namePattern, nameTitle, selectedNodeAttr} from "../../utils"

const css = "widgets-textarea"
	
export class TextArea extends Block {
	get attrs() {
		return {
			name: new Attribute({default: ""}),
			rows: new Attribute({default: 4}),
			cols: new Attribute({default: 60}),
			class: new Attribute({default: css })
		}
	}
	get canBeEmpty() { return true }
}

defParser(TextArea,"textarea",css)

TextArea.prototype.serializeDOM = (node,s) => elt("textarea",node.attrs)

// hack to lock 
TextArea.register("command", "delete", {
  run(pm) { 
	  let {from, node} = pm.selection
	  return node && node.type == this? true: false
  },
  keys: ["Backspace(10)", "Mod-Backspace(10)"]
})

TextArea.register("command", "insert",{
	label: "TextArea",
	run(pm, name, rows, cols) {
    	return pm.tr.replaceSelection(this.create({name,rows,cols})).apply(pm.apply.scroll)
  	},
	params: [
   	    { name: "Name", label: "Short ID", type: "text",
       	  prefill: function(pm) { return selectedNodeAttr(pm, this, "name")},
     		  options: {
     			  pattern: namePattern, 
     			  size: 10, 
     			  title: nameTitle
     		  }},
     		  { name: "Rows", label: "In lines", type: "number", default: "4", options: {min: 2, max:24}, 
     			  prefill: function(pm) { return selectedNodeAttr(pm, this, "rows") }
     		  },
     	      { name: "Columns", label: "In characters", type: "number", default: "40", 
     			  prefill: function(pm) { return selectedNodeAttr(pm, this, "cols") },
     			  options: {min: 2, max:80}
     		  }
   	]
})

insertCSS(`

.ProseMirror .${css}:hover {
	cursor: pointer;
}

`)