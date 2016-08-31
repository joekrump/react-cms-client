import {MenuCommandGroup} from "prosemirror/dist/menu/menu"
import {Doc, Paragraph, Textblock, Block, Attribute, Pos} from "prosemirror/dist/model"
import {elt, insertCSS} from "prosemirror/dist/dom"
import {canWrap} from "prosemirror/dist/transform"
import {defParser} from "../../utils"

function getTextblockDepth(pm,$pos) {
	for (let i = $pos.depth; i > 0; i--)
		if ($pos.node(i).type instanceof Textblock) return i
	return 0	
}

function findAlignWrapper(pm,align) {
	let {from, to, node} = pm.selection, $from = pm.doc.resolve(from), $to = pm.doc.resolve(to), isLeft = align.name == "leftalign"
	let depth = getTextblockDepth(pm,$from)
	if (depth > 0 && $from.node(depth-1).type instanceof Align) {
		let tr = pm.tr.lift($from.start(depth), $from.end(depth)).apply(pm.apply.scroll)
		if (!isLeft)
			tr = pm.tr.wrap($from.start(depth),$from.end(depth),align,{class: align.style}).apply(pm.apply.scroll)
		return tr
	} else {
		if (isLeft) return false  //left is default and doesn't need wrapper
		let $end = from == to? $from: $to
		return pm.tr.wrap($from.start(depth),$end.end(depth),align,{class: align.style}).apply(pm.apply.scroll)
	}
}

class Align extends Block {
	get attrs() { return {class: new Attribute({default: "widgets-leftalign"})} }
}

Align.prototype.serializeDOM = (node,s) => s.renderAs(node,"div", node.attrs)

export const alignGroup = new MenuCommandGroup("align")

export class LeftAlign extends Align { get style() { return  "widgets-leftalign"}}
export class CenterAlign extends Align { get style() { return "widgets-centeralign"}}
export class RightAlign extends Align { get style() { return  "widgets-rightalign"}}


defParser(LeftAlign,"div","icons/leftalign.png")
defParser(CenterAlign,"div","widgets-centeralign")
defParser(RightAlign,"div","widgets-rightalign")

function alignApplies(pm,type) {
	let {from, to, node} = pm.selection, $from = pm.doc.resolve(from), isLeft = type.name == "leftalign"
	let index = getTextblockDepth(pm,$from)
	if (isLeft && index == 0) return true
	return $from.parent.type.name == type.name
}

function defAlign(type,label,path) {
	type.register("command", "align", {
		run(pm) { return findAlignWrapper(pm,this)},
		active(pm) { return alignApplies(pm, this)},
		label: label,
		menu: {
			group: "align", rank: 51,
		    display: {
		      type: "icon",
		      width: 8, height: 8,
		      path: path
		    }
		}
	}
)}

defAlign(LeftAlign,"Left Align","M0 0v1h8v-1h-8zm0 2v1h6v-1h-6zm0 2v1h8v-1h-8zm0 2v1h6v-1h-6z")
defAlign(CenterAlign,"Center Align","M0 0v1h8v-1h-8zm1 2v1h6v-1h-6zm-1 2v1h8v-1h-8zm1 2v1h6v-1h-6z")
defAlign(RightAlign,"Right Align","M0 0v1h8v-1h-8zm2 2v1h6v-1h-6zm-2 2v1h8v-1h-8zm2 2v1h6v-1h-6z")

insertCSS(`
div.widgets-leftalign {
	text-align: left;
}

div.widgets-centeralign {
	text-align: center;
	margin: 0 auto;
}

div.widgets-rightalign {
	text-align: right;
	float: right;
}

div.widgets-justifyalign {
	text-align: justify;
}

`)