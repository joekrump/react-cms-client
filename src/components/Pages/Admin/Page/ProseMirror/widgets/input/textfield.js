import {Inline, Attribute} from "prosemirror/dist/model"
import {elt, insertCSS} from "prosemirror/dist/util/dom"
import {Input} from "./input"
import {defParser, defParamsClick, namePattern, nameTitle, selectedNodeAttr} from "../../utils"

const css = "widgets-textfield"
export class TextField extends Input {
	get attrs() {
		return {
			name: new Attribute({default: ""}),
			type: new Attribute({default: "text"}),
			size: new Attribute({default: "20"}),
			class: new Attribute({default: css})
		}
	}
	get canBeEmpty() { return true }
}

defParser(TextField,"input",css)

TextField.register("command", "insert",{
	label: "TextField",
	run(pm, name) {
    	return pm.tr.replaceSelection(this.create({name})).apply(pm.apply.scroll)
  	},
 	params: [
 	  	    { name: "Name", label: "Short ID", type: "text",
 	     	  prefill: function(pm) { return selectedNodeAttr(pm, this, "name") },
 	   		  options: {
 	   			  pattern: namePattern, 
 	   			  size: 10, 
 	   			  title: nameTitle}},
 	     	{ name: "Size", label: "Size in characters", type: "number", default: "20", 
 			  prefill: function(pm) { return selectedNodeAttr(pm, this, "size") },
 		      options: {min: 1, max:80}}
 		]
})

insertCSS(`

.ProseMirror .${css}:hover {
	cursor: pointer;
}

`)