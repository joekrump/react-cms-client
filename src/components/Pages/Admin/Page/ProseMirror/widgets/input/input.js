import {Block, Inline, Attribute} from "prosemirror/dist/model"
import {elt, insertCSS} from "prosemirror/dist/util/dom"
import {defParser} from "../../utils"

const css = "widgets-input"
	
export class Input extends Block {
	get attrs() {
		return {
			name: new Attribute,
			type: new Attribute({default: "text"}),
			value: new Attribute
		}
	}
	get selectable() { return false }
}

defParser(Input,css)

Input.prototype.serializeDOM = node => elt("input",node.attrs)

insertCSS(`
		
.${css} {}

`)