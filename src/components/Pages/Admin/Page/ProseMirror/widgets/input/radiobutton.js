import {Attribute} from "prosemirror/dist/model"
import {elt, insertCSS} from "prosemirror/dist/dom"
import {defParser} from "../../utils"
import {Input} from "./input"

const css = "widgets-radiobutton"
	
export class RadioButton extends Input {
	get attrs() {
		return {
			name: new Attribute({default: ""}),
			type: new Attribute({default: "radio"}),
			value: new Attribute({default: 0}),
			class: new Attribute({default: css})
		}
	}
}

defParser(RadioButton,"input",css)

insertCSS(`

.${css} {}

`)