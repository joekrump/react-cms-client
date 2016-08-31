import {Block, Inline, Attribute} from "prosemirror/dist/model"
import {elt, insertCSS} from "prosemirror/dist/util/dom"
import {defParser, defParamsClick, namePattern, nameTitle, selectedNodeAttr} from "../../utils"

const css = "widgets-carryforward"
	
function getCarryOptions(names) {
	return names.map(w => ({value: w, label: w}))
}
 
export class CarryForward extends Inline {
	serializeDOM(node,s) {
		return elt("thinkspace",node.attrs,
			elt("img",{src: "icons/forward.png", width:16, height:16, title:"Carry forward "+node.attrs.name})
		)
	}
	get attrs() {
		return {
			name: new Attribute,
			model: new Attribute({default: "user_response"}),
			type: new Attribute({default: "carry_forward"}),
			class: new Attribute({default: css+" widgets-edit"})
		}
	}
}
                             
defParser(CarryForward,"thinkspace",css)

CarryForward.register("command", "insert", {
	derive: {
		params: [ 
		   { name: "Name", attr: "name", label: "Element name", type: "select",
	         prefill: function(pm) { return selectedNodeAttr(pm, this, "name") },
	  		 options: function() { return getCarryOptions(["test1","test2"])}}
	 	]
	},
	label: "CarryForward",
	menu: {group: "insert", rank: 73, select: "disable", display: {type: "label", label: "Carry Forward"}},
})

defParamsClick(CarryForward,"carryforward:insert",["all"])

insertCSS(`

.ProseMirror .${css} img:hover {
	cursor: pointer;
}

`)