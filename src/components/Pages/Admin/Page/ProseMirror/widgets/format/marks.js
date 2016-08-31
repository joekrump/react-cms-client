import {MarkType} from "prosemirror/dist/model"
import {elt, insertCSS} from "prosemirror/dist/dom"
import {defParser} from "../../utils"

export class UnderlineMark extends MarkType {}

UnderlineMark.prototype.serializeDOM = (mark,s) => s.elt("span",{style: "text-decoration: underline;"})

UnderlineMark.register("command", "set", {derive: true, label: "Set underline"})
UnderlineMark.register("command", "unset", {derive: true, label: "Unset underline"})

UnderlineMark.register("command", "toggle", {
  derive: true,
  label: "Toggle underline",
  menu: {
    group: "inline", rank: 22,
	select: "disable",
    display: {
      type: "icon",
      width: 8, height: 8,
      path: "M1 0v4c0 1.1 1.12 2 2.5 2h.5c1.1 0 2-.9 2-2v-4h-1v4c0 .55-.45 1-1 1s-1-.45-1-1v-4h-2zm-1 7v1h7v-1h-7z"
    }
  },
  keys: ["Mod-U"]
})

UnderlineMark.register("parseDOMStyle", "text-decoration", {parse: function(value, state, inner) {
	if (value == "underline") state.wrapMark(inner, this)
	else inner()
}})

export class StrikeThroughMark extends MarkType {}

StrikeThroughMark.prototype.serializeDOM = (mark,s) => s.elt("span",{style: "text-decoration: line-through;"})

StrikeThroughMark.register("command", "set", {derive: true, label: "Set strike-through"})
StrikeThroughMark.register("command", "unset", {derive: true, label: "Unset strike-through"})

StrikeThroughMark.register("command", "toggle", {
  derive: true,
  label: "Toggle strike-through",
  menu: {
    group: "inline", rank: 23,
	select: "disable",
    display: {
      type: "icon",
      width: 512, height: 512,
      path: "M100.382,486.283v-69.5c8.006,7.789,17.585,14.803,28.743,21.053c11.151,6.263,22.901,11.513,35.257,15.776  c12.349,4.276,24.756,7.578,37.217,9.934c12.467,2.368,23.974,3.54,34.526,3.54c36.454,0,63.664-6.908,81.638-20.711  c17.948-13.815,26.948-33.671,26.948-59.565c0-13.474-3.026-25.237-9.053-35.264s-14.329-19.157-24.921-27.395  c-10.593-8.237-23.132-16.145-37.605-23.737l-31.224-15.895H0v-53.895h149.289c-4.395-3.553-8.552-7.224-12.474-11.007  c-11.342-10.928-20.25-23.315-26.724-37.164c-6.474-13.842-9.71-30.086-9.71-48.73c0-22.829,5.105-42.685,15.322-59.56  c10.217-16.881,23.638-30.789,40.257-41.717c16.611-10.928,35.552-19.066,56.809-24.421C234.033,2.678,255.704,0,277.789,0  c50.29,0,86.974,6.625,110.026,19.875V86.23c-29.868-23.947-68.236-35.928-115.078-35.928c-12.954,0-25.908,1.388-38.855,4.151  c-12.954,2.776-24.48,7.303-34.586,13.585c-10.105,6.29-18.335,14.375-24.697,24.257c-6.361,9.882-9.546,21.935-9.546,36.151  c0,12.803,2.414,23.862,7.243,33.185c4.829,9.315,11.954,17.809,21.389,25.486c9.434,7.671,20.921,15.119,34.467,22.343  l41.73,21.164H512v53.895H359.395c3.474,2.961,6.816,5.987,10,9.093c12.29,11.907,22.014,25.065,29.211,39.46  c7.184,14.421,10.763,30.947,10.763,49.579c0,24.711-4.921,45.605-14.763,62.711c-9.843,17.104-23.105,31-39.79,41.71  c-16.71,10.711-35.947,18.435-57.776,23.185c-21.828,4.763-44.822,7.132-69,7.132l-29.861-2.079  c-11.829-1.382-23.921-3.396-36.27-6.053c-12.349-2.658-24.026-5.961-35.033-9.895C115.875,495.44,107.039,491.072,100.382,486.283z  "
    }
  },
  keys: ["Mod-S"]
})

StrikeThroughMark.register("parseDOMStyle", "text-decoration", {parse: function(value, state, inner) {
	if (value == "line-through") state.wrapMark(inner, this)
	else inner()
}})


insertCSS(`
`)