import {CommandSet} from "prosemirror/dist/edit"
// import {insertCSS} from "prosemirror/dist/dom"
import {inlineGroup, insertMenu, textblockMenu, blockGroup, historyGroup} from "prosemirror/dist/menu/menu"
import {Doc, Textblock, BlockQuote, OrderedList, BulletList, ListItem, HorizontalRule,
  Paragraph, Heading, Text, HardBreak,
  EmMark, StrongMark, LinkMark, CodeMark, Schema, SchemaSpec} from "prosemirror/dist/model"
import {Question, TextBox, ShortAnswer, Essay, Choice, MultipleChoice, 
  ScaleDisplay, Scale, CheckItem, CheckList, Selection} from "./widgets/questions"
import {Input, RadioButton, CheckBox, Select, TextField, TextArea} from "./widgets/input"
import {Website, InlineMath, BlockMath, Image, SpreadSheet, CarryForward, Graph } from "./widgets/content"
import {alignGroup, LeftAlign, CenterAlign, RightAlign, UnderlineMark, StrikeThroughMark, contentInsertMenu, questionInsertMenu, toolGroup} from "./widgets"
import {analyzeCmdSpec, commentCmdSpec} from "./widgets/tool"

import './schema.css'

export const widgetSchema = new Schema({
  nodes: {
      doc: {type: Doc, content: "(block | question | content)+"},
      blockquote: {type: BlockQuote, content: "block+"},
      ordered_list: {type: OrderedList, content: "list_item+"},
      bullet_list: {type: BulletList, content: "list_item+"},
      list_item: {type: ListItem, content: "block+"},
      horizontal_rule: {type: HorizontalRule},

      // blocks
      paragraph: {type: Paragraph, content: "inline[_]*"},
      heading: {type: Heading, content: "inline_only[_]*"},
    textbox: {type: TextBox, content:"inline[_]*"},
    choice: {type: Choice, content: "radiobutton textbox"},
    multiplechoice: {type: MultipleChoice, content: "paragraph+ choice+"},
    scaledisplay: {type: ScaleDisplay},
    scale: {type: Scale, content: "paragraph+ scaledisplay"},
    checkitem: {type: CheckItem, content: "checkbox textbox"},
    checklist: {type: CheckList, content: "paragraph+ checkitem+"},
    shortanswer: {type: ShortAnswer, content: "paragraph+ textfield"},
    essay: {type: Essay, content: "paragraph+ textarea"},
    selection: {type: Selection, content: "paragraph+ select"},
    blockmath: {type: BlockMath},
    website: {type: Website},
    spreadsheet: {type: SpreadSheet},
    graph: {type: Graph},

    // inline
      text: {type: Text},
      image: {type: Image},
      hard_break: {type: HardBreak},
    inlinemath: {type: InlineMath},
    carryforward: {type: CarryForward},

    // form elements
    checkbox: {type: CheckBox},
    radiobutton: {type: RadioButton},
    select: {type: Select},
    textfield: {type: TextField},
    textarea: {type: TextArea},

    // alignment
    leftalign: {type: LeftAlign},
    centeralign: {type: CenterAlign},
    rightalign: {type: RightAlign}
  },

  groups: {
      block: ["paragraph", "blockquote", "ordered_list", "bullet_list", "heading", "horizontal_rule"],
      content: ["blockmath", "website", "spreadsheet", "graph"],
      question: ["multiplechoice", "checklist", "essay", "shortanswer", "scale", "selection"],
      input: ["checkbox", "radiobutton", "select", "textfield", "textarea"],
      inline: ["text", "image", "hard_break", "inlinemath", "carryforward", "input"],
      inline_only: ["text", "image", "hard_break"]
  },

  marks: {
    em: EmMark,
    strong: StrongMark,
    link: LinkMark,
    code: CodeMark,
    underline: UnderlineMark,
    strikethrough: StrikeThroughMark
  }
})

export const mainMenuBar = {
  float: true,
  content: [[inlineGroup, insertMenu], [blockGroup,textblockMenu],alignGroup,[contentInsertMenu,questionInsertMenu],toolGroup, historyGroup]   
}

export const grammarMenuBar = {
  float: true,
  content: [[inlineGroup, insertMenu], [blockGroup,textblockMenu],alignGroup,[contentInsertMenu,questionInsertMenu], toolGroup, historyGroup]  
}

export const commentMenuBar = {
  float: true,
  content: [toolGroup]
}

textblockMenu.options.label = "Format"

const strongIcon = {
    type: "icon",
    width: 805, height: 1024,
    path: "M317 869q42 18 80 18 214 0 214-191 0-65-23-102-15-25-35-42t-38-26-46-14-48-6-54-1q-41 0-57 5 0 30-0 90t-0 90q0 4-0 38t-0 55 2 47 6 38zM309 442q24 4 62 4 46 0 81-7t62-25 42-51 14-81q0-40-16-70t-45-46-61-24-70-8q-28 0-74 7 0 28 2 86t2 86q0 15-0 45t-0 45q0 26 0 39zM0 950l1-53q8-2 48-9t60-15q4-6 7-15t4-19 3-18 1-21 0-19v-37q0-561-12-585-2-4-12-8t-25-6-28-4-27-2-17-1l-2-47q56-1 194-6t213-5q13 0 39 0t38 0q40 0 78 7t73 24 61 40 42 59 16 78q0 29-9 54t-22 41-36 32-41 25-48 22q88 20 146 76t58 141q0 57-20 102t-53 74-78 48-93 27-100 8q-25 0-75-1t-75-1q-60 0-175 6t-132 6z"
  }

const emIcon = {
    type: "icon",
    width: 585, height: 1024,
    path: "M0 949l9-48q3-1 46-12t63-21q16-20 23-57 0-4 35-165t65-310 29-169v-14q-13-7-31-10t-39-4-33-3l10-58q18 1 68 3t85 4 68 1q27 0 56-1t69-4 56-3q-2 22-10 50-17 5-58 16t-62 19q-4 10-8 24t-5 22-4 26-3 24q-15 84-50 239t-44 203q-1 5-7 33t-11 51-9 47-3 32l0 10q9 2 105 17-1 25-9 56-6 0-18 0t-18 0q-16 0-49-5t-49-5q-78-1-117-1-29 0-81 5t-69 6z"
}

const linkIcon = {
  type: "icon",
  width: 951, height: 1024,
  path: "M832 694q0-22-16-38l-118-118q-16-16-38-16-24 0-41 18 1 1 10 10t12 12 8 10 7 14 2 15q0 22-16 38t-38 16q-8 0-15-2t-14-7-10-8-12-12-10-10q-18 17-18 41 0 22 16 38l117 118q15 15 38 15 22 0 38-14l84-83q16-16 16-38zM430 292q0-22-16-38l-117-118q-16-16-38-16-22 0-38 15l-84 83q-16 16-16 38 0 22 16 38l118 118q15 15 38 15 24 0 41-17-1-1-10-10t-12-12-8-10-7-14-2-15q0-22 16-38t38-16q8 0 15 2t14 7 10 8 12 12 10 10q18-17 18-41zM941 694q0 68-48 116l-84 83q-47 47-116 47-69 0-116-48l-117-118q-47-47-47-116 0-70 50-119l-50-50q-49 50-118 50-68 0-116-48l-118-118q-48-48-48-116t48-116l84-83q47-47 116-47 69 0 116 48l117 118q47 47 47 116 0 70-50 119l50 50q49-50 118-50 68 0 116 48l118 118q48 48 48 116z"
}

export const commands = CommandSet.default.update({
    selectParentNode: { menu: null},
    lift: { menu: null},
    "code:toggle": {menu: {group: "textblock", rank: 99, select: "disable", display: {type: "label", label: "Code" }}},
    "strong:toggle": {menu: { group: "inline", rank: 20, select: "disable", display: strongIcon}}, 
    "em:toggle": {menu: { group: "inline", rank: 21, select: "disable", display: emIcon}}
})

export const commentCommands = CommandSet.default.update({
    selectParentNode: { menu: null},
    lift: { menu: null},
    "code:toggle": {menu: {group: "textblock", rank: 99, select: "disable", display: {type: "label", label: "Code" }}},
    "strong:toggle": {menu: { group: "inline", rank: 20, select: "disable", display: strongIcon}}, 
    "em:toggle": {menu: { group: "inline", rank: 21, select: "disable", display: emIcon}},
    comment: commentCmdSpec
})

export const noCommands = new CommandSet(null, () => null)

export const commentOnlyCommands = noCommands.update({ comment: commentCmdSpec })


export const grammarCommands = CommandSet.default.update({
    selectParentNode: { menu: null},
    lift: { menu: null},
    "code:toggle": {menu: {group: "textblock", rank: 99, select: "disable", display: {type: "label", label: "Code" }}},
    "strong:toggle": {menu: { group: "inline", rank: 20, select: "disable", display: strongIcon}}, 
    "em:toggle": {menu: { group: "inline", rank: 21, select: "disable", display: emIcon}},
    analyze: analyzeCmdSpec
})