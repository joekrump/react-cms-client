import {Block, Attribute} from "prosemirror/dist/model"
import {elt,insertCSS} from "prosemirror/dist/util/dom"
import {defParser, defParamsClick, selectedNodeAttr} from "../../utils"
import {insertWidget} from "./index"

const css = "widgets-blockmath"
export class BlockMath extends Block {
	serializeDOM(node,s){
		if (node.rendered) {
			node.rendered = node.rendered.cloneNode(true)
		} else {
			node.rendered = elt("div", {class: css+" widgets-edit"}, "\\["+node.attrs.tex+"\\]");
			// wait until node is attached to document to render
			MathJax.Hub.Queue(["Delay",MathJax.Callback,100],["Typeset",MathJax.Hub,node.rendered])
		}
		return node.rendered; 
	}
	get attrs() {
		return {
			tex: new Attribute
		}
	}
}

defParser(BlockMath,"div", css)

BlockMath.prototype.serializeDOM = node => {
	if (node.rendered) {
		node.rendered = node.rendered.cloneNode(true)
	} else {
		node.rendered = elt("div", {class: css+" widgets-edit"}, "\\["+node.attrs.tex+"\\]");
		// wait until node is attached to document to render
		MathJax.Hub.Queue(["Delay",MathJax.Callback,100],["Typeset",MathJax.Hub,node.rendered])
	}
	return node.rendered; 
}

BlockMath.register("command", "insert", {
	label: "BlockMath",
	run(pm, tex) {
		let {from,to,node} = pm.selection
		if (node && node.type == this) {
			let tr = pm.tr.setNodeType(from, this, {tex}).apply()
			return tr
		} else
			return insertWidget(pm,from,this.create({tex}))
	},
	select(pm) {
  		return true
	},
	menu: {group: "content", rank: 72, display: {type: "label", label: "Block Math"}},
	params: [
      	{ name: "Latex", attr: "tex", label: "Latex Expression", type: "text", 
      	  prefill: function(pm) { return selectedNodeAttr(pm, this, "tex") }}
    ]
})

defParamsClick(BlockMath,"blockmath:insert")

insertCSS(`

.ProseMirror .${css} {
	display: inline-block;
}
}

`)