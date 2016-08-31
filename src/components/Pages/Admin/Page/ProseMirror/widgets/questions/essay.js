import {Fragment, Block, Attribute, Pos} from "prosemirror/dist/model"
import {insertCSS} from "prosemirror/dist/util/dom"
import {defParser, defParamsClick, namePattern, nameTitle, selectedNodeAttr, getLastClicked} from "../../utils"
import {Question, qclass, setChildAttrs, insertQuestion} from "./question"
import {checkUniqueName} from "../../widgets"

const css = "widgets-essay"
	
export class Essay extends Question {
	get attrs() {
		return {
			name: new Attribute({default: ""}),
			title: new Attribute({default: ""}),
			rows: new Attribute({default: 4}),
			cols: new Attribute({default: 60}),
			class: new Attribute({default: css+" "+qclass})
		}
	}
	defaultContent(attrs) {
		return Fragment.from([
		    this.schema.nodes.paragraph.create(null,""),
		    this.schema.nodes.textarea.create(attrs)
		])
	}
	create(attrs, content, marks) {
		if (!content) content = this.defaultContent(attrs)
		return super.create(attrs,content,marks)
	}
}

defParser(Essay,"div",css)

Essay.register("command", "insert", {
	label: "Essay",
	run(pm, name, title, rows, cols) {
		let {from, node} = pm.selection, $from = pm.doc.resolve(from)
		let attrs = {name,title,rows,cols}
		if (node && node.type instanceof Essay) {
			let tr = pm.tr.setNodeType(from, this, attrs).apply(pm.apply.scroll)
			$from = pm.doc.resolve(from)
			return setChildAttrs(pm,$from.nodeAfter,from+1,"textarea",attrs)
		} else
			return insertQuestion(pm,from,this.create(attrs))
  	},
    select(pm) { return from.parent.type.canContainType(this)},
	menu: {group: "question", rank: 72, display: {type: "label", label: "Essay"}, select: "ignore"},
	params: [
  	    { name: "Name", attr: "name", label: "Short ID", type: "text",
     	  prefill: function(pm) { return selectedNodeAttr(pm, this, "name")},
   		  options: {
   			  pattern: namePattern, 
   			  size: 10, 
   			  title: nameTitle
   		  }},
 		{ name: "Title", attr: "title", label: "(optional)", type: "text", default: "",
       	  prefill: function(pm) { return selectedNodeAttr(pm, this, "title") },
     	  options: {
       		required: '' 
       	  }},
   		  { name: "Rows", attr: "rows", label: "In lines lines", type: "number", default: 4, options: {min: 2, max:24}, 
   			  prefill: function(pm) { return selectedNodeAttr(pm, this, "rows") }
   		  },
   	      { name: "Columns", attr: "cols", label: "In characters", type: "number", default: 60, 
   			  prefill: function(pm) { return selectedNodeAttr(pm, this, "cols") },
   			  options: {min: 2, max:80}
   		  }
	]
}) 

defParamsClick(Essay,"essay:insert")

insertCSS(`

.ProseMirror .${css} textarea {
	resize: none;
}

`)