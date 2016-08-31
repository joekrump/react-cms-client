import {Inline, Block, Textblock} from "prosemirror/dist/model"
import {elt, insertCSS} from "prosemirror/dist/util/dom"
import {defParser} from "../../utils"

const css = "widgets-textbox"
	
export class TextBox extends Textblock {
}

defParser(TextBox,"div",css)

TextBox.prototype.serializeDOM = (node,s) => s.renderAs(node,"div",{class: css})


insertCSS(`

.${css} {
	margin-left: 1.2em;
}

`)