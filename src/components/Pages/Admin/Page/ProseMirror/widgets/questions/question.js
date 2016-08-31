import {Block, Paragraph, Attribute, Pos, Textblock} from "prosemirror/dist/model"
import {elt, insertCSS} from "prosemirror/dist/dom"
import {defParser, defParamsClick} from "../../utils"
import {joinPoint, joinableBlocks, canLift} from "prosemirror/dist/transform"
import {TextBox} from "./textbox"

const css = "widgets-question"
	
export const qclass = css+" widgets-edit"

export function setChildAttrs(pm, parent, parentpos, type, attrs) {
	//if attrs are same then don't change
	let pa = parent.attrs
	for (let key in pa) if (pa[key] != attrs[key]) return
	parent.forEach((node,start) => {
		if (node.type.name == type)
			return pm.tr.setNodeType(parentpos+start, node.type, attrs).apply()
	})
	return false
}

export function insertQuestion(pm,pos,q) {
	let $pos = pm.doc.resolve(pos)
	let p = $pos.end(1) //insert at document level
	pm.tr.insert(p,q).apply(pm.apply.scroll)
	// set text cursor to paragraph in widget if there is one
	if (q.firstChild && q.firstChild.isTextblock)
    	pm.setTextSelection(p+3)

}

export class Question extends Block {
	serializeDOM(node,s) { return s.renderAs(node,"div",node.attrs) }
	get draggable() { return true }
	getDropPos(pm, from, to) { 
		if (!to) return null
		let $to = pm.doc.resolve(to)
		return $to.start(1)
	}
}

// disable deletion of first question paragraph
Question.register("command", "delete", {
	label: "delete text from question",
	run(pm) {
		let {from, node} = pm.selection, $from = pm.doc.resolve(from)
		if ($from.parentOffset > 0 || from < 2) return false
		let $prev = pm.doc.resolve(from-2)
		// delete whole question
		if ($prev.parent.type instanceof Question)
			return pm.tr.delete($prev.before($prev.depth),$prev.after(($prev.depth))).apply(pm.apply.scroll)
		if (!($from.parent.type instanceof TextBox)) return false
		let parent = $from.node($from.depth-2)
		// don't let empty question or choice be deleted
		return parent.type instanceof Question
	},
	keys: ["Backspace(10)", "Mod-Backspace(10)"]
})

// disable lifting on empty paragraph
Question.register("command", "enter", {
	label: "process enter",
	run(pm) {
		let {from,node} = pm.selection, $from = pm.doc.resolve(from)
		if (node && node.type instanceof Question) {
			let parent = $from.parent
			if (parent.lastChild == node || !parent.child(from.offset+1).isTextblock) {
				let side = $from.end($from.depth)
			    pm.tr.insert(side, pm.schema.defaultTextblockType().create()).apply(pm.apply.scroll)
			    pm.setTextSelection(side+3)
			}
			return true
		}
		if ($from.parentOffset > 0 || $from.depth < 3 || !($from.parent.type instanceof Textblock)) return false
		let parent = $from.node($from.depth-2)
		return (parent.type instanceof Question)
	},
	keys: ["Enter(10)", "Mod-Enter(10)"]
})

insertCSS(`
		
.${css} {
	counter-increment: qcnt;
	border: 1px solid #DDD;
    border-radius: 4px;
	padding: 8px;
	margin-top: 1em;
}

.${css}:before {
	content: counter(qcnt)"." attr(title);
	font-size: 80%;
	font-weight: bold;
	cursor: grabbing;
}

.ProseMirror .${css} p:hover {
    cursor: text;
}

`)