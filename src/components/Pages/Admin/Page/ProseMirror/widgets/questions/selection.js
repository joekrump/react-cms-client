import {Fragment,Block, Attribute, Pos, NodeKind} from "prosemirror/dist/model"
import {insertCSS} from "prosemirror/dist/dom"
import {Select} from "../input"
import {defParser, defParamsClick, namePattern, nameTitle, selectedNodeAttr, getLastClicked} from "../../utils"
import {Question, qclass, setChildAttrs, insertQuestion} from "./question"

const css = "widgets-selection"
	
export class Selection extends Question {
	get attrs() {
		return {
			name: new Attribute({default: ""}),
			title: new Attribute({default: ""}),
			options: new Attribute({default: ""}),
			size: new Attribute({default: 1}),
		    multiple: new Attribute({default: "single"}),
		    class: new Attribute({default: css+" "+qclass})
		}
	}
	defaultContent(attrs) {
		return Fragment.from([
		     this.schema.nodes.paragraph.create(null,""),
		     this.schema.nodes.select.create(attrs)
		])
	}
	create(attrs, content, marks) {
		if (!content) content = this.defaultContent(attrs)
		return super.create(attrs,content,marks)
	}
}

defParser(Selection,"div",css)

Selection.register("command", "insert", {
	label: "Selection",
	run(pm, name, title, options, size, multiple) {
		let {from,to,node} = pm.selection
		let attrs = {name,title,options,size,multiple}
		if (node && node.type == this) {
			pm.tr.setNodeType(from, this, attrs).apply(pm.apply.scroll)
			$from = pm.doc.resolve(from)
			return setChildAttrs(pm,$from.nodeAfter,from+1,"select",attrs)
		} else
			return insertQuestion(pm,from,this.create(attrs))
  	},
	menu: {group: "question", rank: 75, display: {type: "label", label: "Selection"}},
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
	       	  }},
	       	{ name: "Options", attr: "options", label: "comma separated names", type: "text", 
	 		  prefill: function(pm) { return selectedNodeAttr(pm, this, "options") }},
 		    { name: "Displayed", attr: "size", label: "options displayed", type: "number", default: 1,
 			  prefill: function(pm) { return selectedNodeAttr(pm, this, "size") },
 			  options: { min: 1, max:10}
 			},
	      	{ name: "Selection", attr: "multiple", label: "Selection (single or multiple)", type: "select", default:"single", 
	 		  prefill: function(pm) { return selectedNodeAttr(pm, this, "multiple") },
	 		  options: [
	      	      {value: "multiple", label:"multiple"},
	      	      {value: "single", label:"single"}
	      	  ]
	 		}
	 ]
}) 

defParamsClick(Selection,"selection:insert")

insertCSS(`

`)