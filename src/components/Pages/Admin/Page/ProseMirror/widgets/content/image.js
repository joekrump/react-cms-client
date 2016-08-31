import {Inline, Attribute} from "prosemirror/dist/model"
import {elt,insertCSS} from "prosemirror/dist/util/dom"
import {defParser, defParamsClick, selectedNodeAttr} from "../../utils"

const css = "widgets-img"
export class Image extends Inline {
	serializeDOM(node, s) { return s.renderAs(node, "img", node.attrs)}
	get attrs() {
		return {
			src: new Attribute,
			alt: new Attribute,
			title: new Attribute,
			class: new Attribute({default: css+" widgets-edit"})
		}
	}
}
 
defParser(Image, "img", css)

Image.register("command", "insert", {
  derive: {
    params: [
	   { name: "File", attr: "src", label: "Image File", type: "file", default: "img.png", 
	  	 prefill: function(pm) { return selectedNodeAttr(pm, this, "src") }},
	   { name: "Description", attr: "alt", label: "Description / alternative text", type: "text", 
	     prefill: function(pm) { return selectedNodeAttr(pm, this, "alt") }},
	   { name: "Title", attr: "title", label: "Title", type: "text",
	  	  prefill: function(pm) { return selectedNodeAttr(pm, this, "title") }}
	 ],
  },
  label: "Image",
  menu: {group: "insert", rank: 70, select: "disable", display: {type: "label", label: "Image"}}
})

defParamsClick(Image,"image:insert",["all"])

insertCSS(`

.ProseMirror .{$css} {}

`)