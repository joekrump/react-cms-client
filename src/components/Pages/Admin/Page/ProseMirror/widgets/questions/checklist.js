import {Block, Textblock, Fragment, Attribute} from "prosemirror/dist/model"
import {elt, insertCSS} from "prosemirror/dist/dom"
import {TextBox} from "./textbox"
import {defParser, defParamsClick, namePattern, nameTitle, selectedNodeAttr} from "../../utils"
import {Question, qclass, insertQuestion} from "./question"

const cssi = "widgets-checkitem"
const cssc = "widgets-checklist"

export class CheckItem extends Block {
	serializeDOM(node,s) { return s.renderAs(node,"div", node.attrs)}
	get attrs() {
		return {
			name: new Attribute({default: ""}),
			value: new Attribute({default: 1}),
			class: new Attribute({default: cssi})
		}
	}
	create(attrs, content, marks) {
		if (content.content) {
			let len = content.content.length
			content = Fragment.from([this.schema.nodes.checkbox.create(attrs),content.content[len-1]])
		}
		return super.create(attrs,content,marks)
	}
}

export class CheckList extends Question {
	get attrs() {
		return {
			name: new Attribute({default: ""}),
			title: new Attribute({default: ""}),
			class: new Attribute({default: cssc + " "+qclass})
		}
	}
	get isList() { return true }
	defaultContent(attrs) {
		let choice_content = Fragment.from([
		    this.schema.nodes.checkbox.create(attrs),
		    this.schema.nodes.textbox.create()
		])
		return Fragment.from([
		    this.schema.nodes.paragraph.create(null,""),
		    this.schema.nodes.checkitem.create(attrs,choice_content)
		])
	}
	create(attrs, content, marks) {
		if (!content) content = this.defaultContent(attrs)
		return super.create(attrs,content,marks)
	}
}

defParser(CheckItem,"div",cssi)
defParser(CheckList,"div",cssc)

function renumber(pm, cl, parentpos) {
	let i = 1
	cl.forEach((node,start) => {
		if (node.type instanceof CheckItem) {
			pm.tr.setNodeType(parentpos+start, node.type, {name: cl.attrs.name+"-"+i, value:i++}).apply()
		}
	})
}

CheckItem.register("command", "split", {
	  label: "Split the current checkitem",
	  run(pm) {
	    let {from, to, node} = pm.selection, $from = pm.doc.resolve(from), $to = pm.doc.resolve(to)
	    if ((node && node.isBlock) || from.depth < 2 || !$from.sameParent($to)) return false
	    let ci = $from.node($from.depth-1)
	    if (ci.type != this) return false    
	    let tr = pm.tr.split(from, 2).apply(pm.apply.scroll)
	    tr = pm.tr.insert(from+3,this.schema.nodes.checkbox.create(ci.attrs)).apply(pm.apply.scroll)
	    $from = pm.doc.resolve(from)
	    renumber(pm, $from.node($from.depth-2),$from.start($from.depth-2))
	    return tr
	  },
	  keys: ["Enter(20)"]
})


CheckItem.register("command", "delete",{
	label: "delete this checkitem or checklist",
	run(pm) {
		let {from,to,head,node} = pm.selection, $from = pm.doc.resolve(from)
		if (node && node.type instanceof CheckList)
			return pm.tr.delete(from,to).apply(pm.apply.scroll)
		if (node) return false
		let ci = $from.node($from.depth-1)
	    if (!(ci.type instanceof CheckItem)) return false
		if ($from.parentOffset > 0) return pm.tr.delete(from,to).apply(pm.apply.scroll)
	    let cl = $from.node($from.depth-2)
	    // if only one choice or still text then ignore
	    if (cl.childCount == 2 || ci.lastChild.content.size > 0) return true
	    let before = $from.before($from.depth-1)
	    let after = $from.after($from.depth-1)
	    let tr = pm.tr.delete(before,after).apply(pm.apply.scroll)
	    $from = pm.doc.resolve(from)
	    if ($from.nodeAfter) {
	    	let $pos = pm.doc.resolve(after)
		    renumber(pm, $from.node($from.depth-2),$from.start($from.depth-2))
	    	pm.setTextSelection($pos.end($pos.depth)-1)
	    } else {
	    	let $pos = pm.doc.resolve(before)
	    	pm.setTextSelection($pos.after($pos.depth)+1)
	    }
	    return tr
	},
	keys: ["Backspace(9)", "Mod-Backspace(9)"]
})

CheckList.register("command", "insert", {
	label: "Check List",
	run(pm, name, title) {
		let {from,node} = pm.selection, $from = pm.doc.resolve(from)
		let attrs = {name,title,value:1}
		if (node && node.type == this) {
			pm.tr.setNodeType(from, this, attrs).apply()
			$from = pm.doc.resolve(from)
			renumber(pm,$from.nodeAfter,from+1)
		} else
			insertQuestion(pm,from,this.create(attrs))
	},
	select(pm) {
  		return true
	},
	menu: {group: "question", rank: 70, display: {type: "label", label: "CheckList"}},
	params: [
 	    { name: "Name", attr: "name", label: "Short ID", type: "text",
   	  	  prefill: function(pm) { return selectedNodeAttr(pm, this, "name") },
 		  options: {
 			  pattern: namePattern, 
 			  size: 10, 
 			  title: nameTitle}},
   		{ name: "Title", attr: "title", label: "(optional)", type: "text", default: "",
       	  prefill: function(pm) { return selectedNodeAttr(pm, this, "title") },
     	  options: {
       		required: '' 
       	}}
	]
})

defParamsClick(CheckList,"checklist:insert")

insertCSS(`

.ProseMirror .${cssi} {
	cursor: text;
}

.ProseMirror .${cssi} input {
	float: left;
}


`)