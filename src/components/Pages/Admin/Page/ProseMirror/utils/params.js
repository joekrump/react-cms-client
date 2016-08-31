import {elt,insertCSS} from "prosemirror/dist/dom"
import {ParamPrompt} from "prosemirror/dist/ui/prompt"
import {defineOption} from "prosemirror/dist/edit"
import {selectableNodeAbove} from "prosemirror/dist/edit/dompos"
import {AssertionError} from "prosemirror/dist/util/error"

let fhandler = null,lastClicked = null
 
export const namePattern = "[A-Za-z0-9_-]{1,10}"
export const nameTitle = "letters,digits, -, _ (max:10)"

export function defineFileHandler(handler) { fhandler = handler}
export function getLastClicked() { return lastClicked }

class WidgetParamPrompt extends ParamPrompt {
	prompt() {
		return openWidgetPrompt(this,{onClose: () => this.close()})
	}
}

defineOption("commandParamPrompt", WidgetParamPrompt)

function openWidgetPrompt(wpp, options) {
	let close = () => {
	    wpp.pm.off("interaction", close)
	    if (dialog.parentNode) {
	      dialog.parentNode.removeChild(dialog)
	      if (options && options.onClose) options.onClose()
	    }
	}
    let submit = () => {
       let params = wpp.values()
       if (params) {
           wpp.command.exec(wpp.pm, params)
           close()
        }
    }
	wpp.pm.on("interaction", close)
	let save = elt("input",{name: "save", type: "button", value: "Save"})
    save.addEventListener("mousedown", e => { submit() })
	let cancel = elt("input",{name: "cancel", type: "button", value: "Cancel"})
    cancel.addEventListener("mousedown", e => {
    	e.preventDefault(); e.stopPropagation()
    	close()
    })
	let buttons = elt("div",{class: "widgetButtons"},save,cancel)
	wpp.form = elt("form",{class: "widgetForm"},
		elt("h4", null, wpp.command.label+" Settings"),
		wpp.fields.map(f => elt("div", null, f)),
		buttons)
	// Submit if Enter pressed and all fields are valid
    wpp.form.addEventListener("keypress", e => { 
     	if (e.keyCode == 13) {
        	e.preventDefault(); e.stopPropagation()
     		save.click()
     	}
   })
    
	let dialog = elt("div",null,elt("div",{class: "widgetDialog"}),wpp.form)
	wpp.pm.wrapper.appendChild(dialog)
	return {close}
}

["text","number","range","email","url","date"].map(type =>
  ParamPrompt.prototype.paramTypes[type] = {
    render(param, value) {
      let field =  elt("input", {type,placeholder: param.label,value,required: "required",autocomplete: "off"})
      let label = param.name? param.name: param.label
      field.setAttribute("name", label)
      let opt = param.options
	  if (opt) for (let prop in opt) { 
		  if (prop == "required") field.removeAttribute(prop) 
		  else field.setAttribute(prop, opt[prop]) 
	  }
	  let fieldLabel = elt("label",{for: label},label)
	  return elt("div", {class: "widgetField"}, fieldLabel, field)
    },
    validate(dom) {
        let input = dom.querySelector("input")
        return input.checkValidity()? null: input.name+": "+input.validationMessage
    },
    read(dom) {
       let input = dom.querySelector("input")
       return input? input.value: input
  }
})

ParamPrompt.prototype.paramTypes.file = {
  render(param,value) {
	let field = elt("input", {type: "text",readonly: true,placeholder: param.label,value,required: "required",autocomplete: "off"})
    let label = param.name? param.name: param.label
    field.setAttribute("name", label)
    let opt = param.options
	if (opt) for (let prop in opt) field.setAttribute(prop, opt[prop])
	let fieldLabel = elt("label",{for: label},label)
	let uploadButton = elt("input",{name: "upload", type: "button", value: "Upload"})
	uploadButton.addEventListener("click",e => { buildUploadForm(pm, field) })
	return elt("div", {class: "widgetField"}, fieldLabel, field, uploadButton)
  },
  validate(dom) {
      let input = dom.querySelector("input")
      return input.checkValidity()? null: input.name+": "+input.validationMessage
  },
  read(dom) {
      let input = dom.querySelector("input")
      return input? input.value: input
  }
}

ParamPrompt.prototype.paramTypes.select = {
  render(param, value) {
    let options = param.options.call ? param.options(this) : param.options
    let field = elt("select", null, options.map(o => elt("option", {value: o.value, selected: o.value == value ? "true" : null}, o.label)))
    field.setAttribute("required","required")
    let label = param.name? param.name: param.label
    field.setAttribute("name", label)
	let fieldLabel = elt("label",{for: name},label)
	return elt("div", {class: "widgetField"}, fieldLabel, field)
  },
  validate(dom) {
    let select = dom.querySelector("select")
    return select.checkValidity()? null: select.name+": "+select.validationMessage
  },
  read(dom) {
    let select = dom.querySelector("select")
    return select? select.value: select
  }
}

export function defParamsClick(type, cmdname, spots = ["topright"]) {
	type.prototype.handleClick = (pm, e, pos, node) => {
		e.preventDefault()
		pm.setNodeSelection(pos)
		pm.focus()
		lastClicked = e.target
		let spotClicked = false
		spots.forEach(loc => {
			let r = e.target.getBoundingClientRect()
			if (loc == "all") spotClicked = true;
			else if (loc == "topright") spotClicked = spotClicked || (e.clientX > (r.right-16) && e.clientY < (r.top+16))
			else if (loc == "topleft") spotClicked = spotClicked || (e.clientX < (r.left+16) && e.clientY < (r.top+16))
			else if (loc == "bottomright") spotClicked = spotClicked || (e.clientX > (r.right-32) && e.clientY > (r.bottom-32))			
		})
		if (spotClicked) {
			let cmd = pm.commands[cmdname]
			if (cmd) {
				cmd.exec(pm)
				return true;
			} else
				return false;
		}
	}
}

export function selectedNodeAttr(pm, type, name) {
  let {node} = pm.selection
  if (node && node.type == type) return node.attrs[name]
}


function FileDragHover(e) {
	e.stopPropagation();
	e.preventDefault();
	e.target.className = (e.type == "dragover" ? "hover" : "");
}

function buildUploadForm(pm, field) {
	let legend = elt("h4", null, "File Upload")
	let inputHidden = elt("input",{type: "hidden", id: "MAX_FILE_SIZE", name: "MAX_FILE_SIZE", value:"300000"})
	let label = elt("label", {for: "fileselect"},"File to upload:")
	let fileselect = elt("input",{id: "fileselect", type: "file", name: "fileselect[]", multiple: "multiple"})
	let filedrag = elt("div",{id: "filedrag"},"or drop files here")
	let cancel = elt("input",{type: "button", value:"Cancel"})
	cancel.addEventListener("click", e => { 
    	e.preventDefault(); e.stopPropagation()
		pm.wrapper.removeChild(form)
	})
	let saveFile = function(e) {
    	e.preventDefault(); e.stopPropagation()
		FileDragHover(e);
		let files = e.target.files || e.dataTransfer.files;
		if (files) field.value = files[0].name
		if (fhandler) fhandler(files)
		pm.wrapper.removeChild(form)
	}
	fileselect.addEventListener("change", saveFile)
	let xhr = new XMLHttpRequest()
	if (xhr.upload) {
		filedrag.addEventListener("dragover", FileDragHover)
		filedrag.addEventListener("dragleave", FileDragHover)
		filedrag.addEventListener("drop", saveFile)
		filedrag.style.display = "block"
	}
	let form = elt("form",{id: "upload", enctype: "multipart/form-data"},
		legend,
		elt("div",null,
			label,
			fileselect,
			filedrag
		),
		elt("div",null,cancel)
	)
	pm.wrapper.appendChild(form)
}

insertCSS(`

.widgetDialog {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: #FFF;
	z-index: 8888;
	opacity:0.7;
}

.widgetForm {
	font-family: Helvetica, Arial, Sans-Serif;
	font-size: 80%;
	background: white;
	position: absolute;
	top: 10px;
	left: 10px;
	z-index: 9999;
	display: block;
	border-radius: 6px;
	border: 1px solid #AAA;
	padding: 4px;
}

.widgetForm h4 {
	margin: 0;
}

.widgetField {
	display: block;
	padding: 2px;
}

.widgetField label {
	width: 80px;
	color: black;
	display: inline-block;
	padding: 2px;
	float: left;
}

.widgetField input {
	margin: 2px;
	display: inline;
}

.widgetField input[type = "number"] {
	width: 60px;
	margin: 2px;
	display: inline;
}

.widgetField input[type = "button"] {
	margin: 5px;
}

.widgetFieldName {
	color: black;
	display: inline;
	padding: 4px;
}

.widgetButtons {
	text-align: center;
	display: inline-block;
	white-space: nowrap;
}

.widgetButtons input {
	margin: 5px;
}

#upload {
	position: absolute;
	top: 40px;
	left: 40px;
	padding: 5px;
	border: 1px solid #AAA;
	border-radius: 6px;
	background: white;
	z-index: 10000;
	display: block;
}

#upload input {
	margin: 5px;
}

#upload h4 {
	margin: 0;
}

#filedrag {
	display: none;
	font-weight: bold;
	text-align: center;
	padding: 1em 0;
	margin: 1em 0;
	color: #555;
	border: 2px dashed #555;
	border-radius: 6px;
	cursor: default;
}

#filedrag:hover {
	color: #f00;
	border-color: #f00;
	border-style: solid;
	box-shadow: inset 0 3px 4px #888;
}

.ProseMirror-invalid {
	  white-space: nowrap;
	  font-size: 80%;
	  background: white;
	  border: 1px solid red;
	  border-radius: 4px;
	  padding: 5px 10px;
	  position: absolute;
	  min-width: 10em;
	}

`)
