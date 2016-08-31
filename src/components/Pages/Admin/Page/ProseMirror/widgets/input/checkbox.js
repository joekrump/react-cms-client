import {Inline, Attribute} from "prosemirror/dist/model"
import {elt, insertCSS} from "prosemirror/dist/util/dom"
import {Input} from "./input"
import {defParser, defParamsClick, namePattern, nameTitle, selectedNodeAttr} from "../../utils"

const css = "widgets-checkbox"
	
export class CheckBox extends Input {
	get attrs() {
		return {
			name: new Attribute({default: ""}),
			type: new Attribute({default: "checkbox"}),
			value: new Attribute({default: "1"}),
			class: new Attribute({default: css})
		}
	}
}

defParser(CheckBox,"input",css)

CheckBox.register("command", "insert",{
	label: "CheckBox",
	run(pm, name) {
    	return pm.tr.replaceSelection(this.create({name})).apply(pm.apply.scroll)
  	},
	params: [
	    { name: "Name", label: "Short ID", type: "text",
   	  	  prefill: function(pm) { return selectedNodeAttr(pm, this, "name") },
 		  options: {
 			  pattern: namePattern, 
 			  size: 10, 
 			  title: nameTitle}
 		}
   	]
})

defParamsClick(CheckBox,"checkbox:insert",["all"])

insertCSS(`

.ProseMirror .${css}:hover {
	cursor: pointer;
}

`)