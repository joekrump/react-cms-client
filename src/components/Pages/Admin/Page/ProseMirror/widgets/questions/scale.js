import {Fragment, Block, Paragraph, Attribute, Pos} from "prosemirror/dist/model"
import {elt, insertCSS} from "prosemirror/dist/dom"
import {defParser, defParamsClick, namePattern, nameTitle, selectedNodeAttr} from "../../utils"
import {Question, qclass, setChildAttrs, insertQuestion} from "./question"

const cssd = "widgets-scaledisplay"
const csss = "widgets-scale"
	
export class ScaleDisplay extends Block {
	serializeDOM(node,s) {
		let startVal = Number(node.attrs.startvalue)
		let endVal = Number(node.attrs.endvalue)
		let mid = String(Math.round((Math.abs(endVal - startVal))/2))
		let out = elt("input",{for: node.attrs.name, readonly: "readonly"},mid)
		let setOutputValue
		if (startVal < endVal) {
			setOutputValue = function(val) { out.value = val }
		} else {
			let max = startVal
			setOutputValue = function(val) { out.value = max - val }
			endVal = startVal - endVal; startVal = 0
		}
		let range = elt("input",{class: "widgets-input", value: mid, name:node.attrs.name, id: node.attrs.name, type: "range", min: startVal, max: endVal, contenteditable: false})
		range.addEventListener("input",e => {
	    	e.stopPropagation()
	    	setOutputValue(e.originalTarget.valueAsNumber)
		})
		return elt("div",node.attrs,elt("span", null, node.attrs.startlabel),range,elt("span", null,node.attrs.endlabel),out)
	}	
	get attrs() {
		return {
			name: new Attribute({default: ""}),
			startvalue: new Attribute({default: "1"}),
			startlabel: new Attribute({default: "low"}),
			endvalue: new Attribute({default: "10"}),
			endlabel: new Attribute({default: "high"}),
			class: new Attribute({default: cssd})
		}
	}
	get canBeEmpty() { return true }
}

export class Scale extends Question {
	get attrs() {
		return {
			name: new Attribute,
			title: new Attribute({default: ""}),
			startvalue: new Attribute({default: "1"}),
			startlabel: new Attribute({default: "low"}),
			endvalue: new Attribute({default: "10"}),
			endlabel: new Attribute({default: "high"}),
			class: new Attribute({default: "widgets-scale "+qclass})
		}
	}
	defaultContent(attrs) {
		return Fragment.from([
		    this.schema.nodes.paragraph.create(null,""),
		    this.schema.nodes.scaledisplay.create(attrs)
		])
	}
	create(attrs, content, marks) {
		if (!content) content = this.defaultContent(attrs)
		return super.create(attrs,content,marks)
	}
}

defParser(Scale,"div",cssd)
defParser(Scale,"div",csss)

Scale.register("command", "insert",{
	label: "Scale",
	run(pm, name, title, startvalue, startlabel, endvalue, endlabel) {
		let {from,to,node} = pm.selection
		let attrs = {name,title,startvalue,startlabel,endvalue,endlabel}
		if (node && node.type == this) {
			pm.tr.setNodeType(from, this, attrs).apply(pm.apply.scroll)
			let $from = pm.doc.resolve(from)
			return setChildAttrs(pm,$from.nodeAfter,from+1,"scaledisplay",attrs)
		} else
			return insertQuestion(pm,from,this.create(attrs))
  	},
	menu: {group: "question", rank: 74, display: {type: "label", label: "Scale"}},
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
     	{ label: "Start value", attr: "startvalue", type: "number", default: 1, 
		  prefill: function(pm) { return selectedNodeAttr(pm, this, "startvalue") }},
     	{ name: "Start Label", attr: "startlabel", label: "Text on left", type: "text", default: "low",
		  prefill: function(pm) { return selectedNodeAttr(pm, this, "startlabel") }},
     	{ label: "End value", attr: "endvalue", type: "number", default: 10,
  	      prefill: function(pm) { return selectedNodeAttr(pm, this, "endvalue") }},
     	{ name: "End Label", attr: "endlabel", label: "Text on right", type: "text", default: "high", 
  		  prefill: function(pm) { return selectedNodeAttr(pm, this, "endlabel") }}
	]
})

defParamsClick(Scale,"scale:insert")

insertCSS(`

.${cssd} {
	display: inline-block;
	text-align: center;
	font-size: 80%;
}

.${csss} input {
	vertical-align: middle;
	display: inline;
}

.${csss} input[readonly] {
	vertical-align: middle;
	border-radius: 4px;
	text-align: right;
	width: 20px;
	height: 20px;
	border: 1px solid #AAA;
	display: inline;
	padding: 2px;
	margin: 4px;
	background: white;
}

.${csss} span {
	vertical-align: middle;
	font-weight: normal;
	display: inline;
}

.${csss} div {
	display: inline-block;
	padding: 4px;
}

.${csss} input[type=range] {
    -webkit-appearance: none;
    border: 1px solid white;
    width: 200px;
	cursor: pointer;
}
.${csss} input[type=range]::-webkit-slider-runnable-track {
    width: 200px;
    height: 5px;
    background: skyblue;
    border: none;
    border-radius: 3px;
}
.${csss} input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    border: none;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: navy;
    margin-top: -4px;
}
.${csss} input[type=range]:focus {
    outline: none;
}
.${csss} input[type=range]:focus::-webkit-slider-runnable-track {
    background: #ccc;
}

.${csss} input[type=range]::-moz-range-track {
    width: 200px;
    height: 5px;
    background: skyblue;
    border: none;
    border-radius: 3px;
}
.${csss} input[type=range]::-moz-range-thumb {
    border: none;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: navy;
}

.${csss} input[type=range]:-moz-focusring{
    outline: 1px solid white;
    outline-offset: -1px;
}

.${csss} input[type=range]::-ms-track {
    width: 200px;
    height: 5px;
    background: transparent;
    border-color: transparent;
    border-width: 6px 0;

    /*remove default tick marks*/
    color: transparent;
}
.${csss} input[type=range]::-ms-fill-lower {
    background: ;
    border-radius: 10px;
}
.${csss} input[type=range]::-ms-fill-upper {
    background: #ddd;
    border-radius: 10px;
}
.${csss} input[type=range]::-ms-thumb {
    border: none;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: navy;
}
.${csss} input[type=range]:focus::-ms-fill-lower {
    background: #888;
}
.${csss} input[type=range]:focus::-ms-fill-upper {
    background: #ccc;
}
`)