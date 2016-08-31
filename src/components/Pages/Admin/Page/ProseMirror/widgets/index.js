export {BlockMath,CarryForward,Image,InlineMath,SpreadSheet,Website,Graph} from "./content"
export {Input, CheckBox, RadioButton, Select, TextField, TextArea} from "./input"
export {alignGroup,LeftAlign,CenterAlign,RightAlign,UnderlineMark,StrikeThroughMark} from "./format"
export {Question, TextBox, ShortAnswer, Essay, Choice, MultipleChoice, 
	ScaleDisplay, Scale, CheckItem, CheckList, Selection} from "./questions"

import {insertCSS} from "prosemirror/dist/util/dom"
import {Dropdown, MenuCommandGroup} from "prosemirror/dist/menu/menu"

export const contentCommandGroup = new MenuCommandGroup("content")
export const contentInsertMenu = new Dropdown({label: "Content..", displayActive: true, class: "ProseMirror-widgetinsert-dropdown"}, [contentCommandGroup])

export const questionCommandGroup = new MenuCommandGroup("question")
export const questionInsertMenu = new Dropdown({label: "Question..", displayActive: true, class: "ProseMirror-widgetinsert-dropdown"}, [questionCommandGroup])

export const toolGroup = new MenuCommandGroup("tool")

insertCSS(`

.ProseMirror .widgets-edit:hover {
	background-image: url('icons/settings.png');
	background-repeat: no-repeat;
	background-position: top right;
	cursor: pointer;
 }

.ProseMirror-menu-dropdown-item {
	white-space: nowrap;
}
 
.ProseMirror-menu-dropdown-menu {
	border-radius: 6px;
}

.ProseMirror-menu-submenu {
	border-radius: 6px;
}


`)








