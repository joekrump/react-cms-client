import {elt,insertCSS} from "prosemirror/dist/dom"
import {Pos} from "prosemirror/dist/model"
import {onResize} from "../../utils"

let analyzer = require("prosemirror/node_modules/text-stats")
let flesch = require("prosemirror/node_modules/flesch")
let fleschkincaid = require("prosemirror/node_modules/flesch-kincaid")
let passivevoice = require("prosemirror/node_modules/passive-voice")
let comments = document.querySelector("#comments")

let granges = null

let selectedComment = null

export const analyzeCmdSpec = {
	label: "Analyze Grammar",
	select(pm) {return true },
	run(pm) {
		getGrammar(() => {scanGrammar(pm.doc).forEach(g => {comments.appendChild(g.dom)})})
		return true
	},
	menu: {
		group: "tool", rank: 72, 
		display: {
	      type: "icon",
	      width: 8, height: 8,
	      path: "M0 0v1h8v-1h-8zm0 2v1h5v-1h-5zm0 3v1h8v-1h-8zm0 2v1h6v-1h-6zm7.5 0c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5z"
		}
	}
}	

function clearRanges() {
	if (granges) {
		granges.forEach(r => pm.removeRange(r))
		granges = null
	}
}

function clearComments() {
	while (comments.lastChild) comments.removeChild(comments.lastChild)
		comments.appendChild(elt("div",{class: "comment-header"},"Comments"))
}

function clearPositions() { grammar.forEach(g => g.clear()) }


let grammar = null

class GrammarItem {
	constructor(words,msg) {
		this.words = words
		this.msg = msg;
		let re = ""
		words.split(",").forEach(w => {
			w = w.trim().replace(/\./g,"\\.")
			w = "\\b"+w+"\\W"
			re += w+"|"
		})
		re = re.slice(0,-1)
		this.regexp = new RegExp(re,"ig")
		this.clear()
	}
	
	clear() {
		this.loc = []
	}
	
	recordLoc(from, to, path) {
	    from = new Pos(path.slice(), from)
	    to = to == null ? from : new Pos(from.path, to)
	    this.loc.push({from, to})
	}
	
	get dom() {
		let msg = elt("div",{class:"message-hide"},this.msg)
		let icon = elt("img",{src: "icons/question-mark.png", title: "Why?"})
		icon.addEventListener("click", () => {
			msg.className = msg.className == "message-hide"? "message-show": "message-hide"
		})
		let dom = elt("div", {class: "comment"}, elt("div",{class:"words"},this.words),icon,msg)
	    dom.addEventListener("click", () => {
			clearRanges()
			granges = []
			if (selectedComment) selectedComment.className = "comment"
	    	dom.className += " selected"
			selectedComment = dom
			this.loc.forEach(loc => {
		    	let {from, to} = loc
		    	granges.push(pm.markRange(from, to, {className: "highlight-word"}))			
		    })
	    })
		return dom
	}
}

function getGrammar(f) {
	if (grammar) f()
	grammar = []
	let xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
	    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
	    	JSON.parse(xmlhttp.responseText).forEach(g => {
	    		grammar.push(new GrammarItem(g[0],g[1]))
	    	})
	    	f()
	    }
	}
	xmlhttp.open("GET", "grammar.json", true)
	xmlhttp.send()
}

function scanGrammar(doc) {
  clearComments()
  clearRanges()
  clearPositions()
  let result = [], lastHead = null, path = []

  function scan(node, offset) {
    let updatePath = node.isBlock && offset != null
    if (updatePath) path.push(offset)

    if (node.isText)
      grammar.forEach(g => {
    	  let m
    	  while (m = g.regexp.exec(node.text))
    		  g.recordLoc(offset + m.index, offset + m.index + m[0].length, path)
      })
    node.forEach(scan)
    	if (updatePath) path.pop()
  }
  let text = doc.textContent
  let psv = getPassive(text)
  if (psv) grammar.push(psv)
  scan(doc)
  grammar.forEach(g => { if (g.loc.length > 0) result.push(g)})
  result.push(getStats(text))
  if (psv) grammar.pop()
  return result
}

function getStats(text) {
	let stats = analyzer.stats(text)
	let tstats = {sentence: stats.sentences, word: stats.words, syllable: stats.syllables}
	let fstat = flesch(tstats).toFixed(1)
	let fkstat = fleschkincaid(tstats).toFixed(1)
	let msg = "There were "+stats.sentences+" sentences, "+stats.words+" words, and "+stats.syllables+" syllables. "+
	"Flesch:"+ fstat +", FleschKincaid:" + fkstat 
	return new GrammarItem("Summary Statistics",msg)
	return result
}

function getPassive(text) {
	let passive = passivevoice(text)
	if (passive.length > 0) {
		let s = "";
		passive.forEach(loc => {
			s += text.substr(loc.index,loc.offset)+","
		})
		s = s.slice(0,-1)
		return new GrammarItem(s,"Passive voice can be hard to read. Can you make it active?")
	} else
		return null	
}

insertCSS(`
.grammar {
	display: block;
	margin: 0 auto;
	width: 100%;
	height: 400px;
}
		
.grammar #editor {
	float: left;
	width: 70%;
	height: 100%;
}

.grammar #comments {
	border: 1px solid #AAA;
	margin-left: 2px;
	padding: 0;
	height: 100%;
	width: 250px;
	display: inline-block;
	vertical-align: top;
	overflow: scroll;
 }

.grammar .comment-header {
	font-weight: bold;
	font-size: 80%;
	width: 100%;
	background: skyblue;
	color: white;
	margin: 0;
	padding: 4px;
	border-bottom: 1px solid #AAA;
}

.grammar .comment {
	margin: 2px;
	border-radius: 4px;
	border: 1px solid #AAA;
	padding: 2px;
	font-size: 14px;
}

.grammar .comment img {
	float: right;
	cursor: pointer;
}

.grammar .comment .words {
	padding: 2px;
	color: blue;
}

.grammar .comment .message-hide {
	visibility: hidden;
	padding: 2px;	
}

.grammar .comment .message-show {
	visibility: visible;
	padding: 2px;	
}

.selected {
	background: #EEE;
}

.highlight-word {
	background: yellow;
}

`)		
