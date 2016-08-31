import {elt,insertCSS} from "prosemirror/dist/dom"
import {Pos} from "prosemirror/dist/model"
import {eventMixin} from "prosemirror/dist/util/event"
import {getID, onResize} from "../../utils"

let commentsNode = document.querySelector("#comments")
let commentStore = null
let commentMenu = null
let editId = null
let suggestMode

export const commentCmdSpec = {
	label: "Comment",
	select(pm) {
		return true
	},
	run(pm) {
		let addComment = document.querySelector("#addcomment")
		let text = addComment.querySelector("#textcomment")
		text.value = ''
		if (addComment.className == "addComment") return true;
		text.focus()
		addComment.style.top = commentStore.getSelectionTop()+"px"
		addComment.className = "addComment"
		setPlaceholderText(text)
		return true
	},
	menu: {
		group: "tool", rank: 73,
		select: "disable",
		display: {
	      type: "icon",
	      width: 1024, height: 1024,
	      path: "M512 219q-116 0-218 39t-161 107-59 145q0 64 40 122t115 100l49 28-15 54q-13 52-40 98 86-36 157-97l24-21 32 3q39 4 74 4 116 0 218-39t161-107 59-145-59-145-161-107-218-39zM1024 512q0 99-68 183t-186 133-257 48q-40 0-82-4-113 100-262 138-28 8-65 12h-2q-8 0-15-6t-9-15v-0q-1-2-0-6t1-5 2-5l3-5t4-4 4-5q4-4 17-19t19-21 17-22 18-29 15-33 14-43q-89-50-141-125t-51-160q0-99 68-183t186-133 257-48 257 48 186 133 68 183z"
	    }
	}
}

class Comment {
	constructor(id, text, range, mode) {
		this.id = id
		this.text = text
		this.range = range
		this.mode = mode
		this.dom = null
	}
	getRangeClass(select) { return "mode-"+this.mode+(select?"-select":"") }
	get height() { 
		let r = this.dom.getBoundingClientRect()
		return r.bottom-r.top
	}
	get newDom() {
		if (suggestMode) {
			let modeStatus = elt("span",null,this.mode)
			let approval = elt("span",{class: "comment-button"},"Approve")
			let reject = elt("span",{class: "comment-button"},"Reject")
			approval.addEventListener("click", e => { commentStore.approveComment(this.id) })
			reject.addEventListener("click", e => { commentStore.removeComment(this.id) })
			let approvalPanel = elt("div", {class: "approval"},modeStatus,approval,reject)
			this.dom = elt("div",{class: "comment",id:this.id},this.text,approvalPanel)
		} else
			this.dom = elt("div",{class: "comment",id:this.id},this.text)
		this.dom.addEventListener("click", e => {
	    	e.stopPropagation()
			let r = e.target.getBoundingClientRect()
			if (e.clientX > (r.right-16) && e.clientY < (r.top+16)) {
				showMenu(this,e.target.style.top)
			} else {
				if (this.dom.className == "comment")
					commentStore.highlightComment(this.id)
				else
					commentStore.clearHighlight()
			}
		})
		return this.dom
	}
}

function showMenu(comment,top) {
	if (commentMenu.className == "commentMenu") {
		commentMenu.className += " show"
		commentMenu.style.top = top
		editId = comment.id
	} else {
		commentMenu.className = "commentMenu"
		editId = null
	}
}

function getCommentMenu() {
	let edit = elt("li",null,elt("span",null,"Edit"))
	let reply = elt("li",null,elt("span",null,"Reply"))
	let remove = elt("li",null,elt("span",null,"Remove"))
	edit.addEventListener("click", e => {
    	e.stopPropagation()
		showMenu()
	})
	reply.addEventListener("click", e => {
    	e.stopPropagation()
		showMenu()
	})
	remove.addEventListener("click", e => {
		e.stopPropagation()
		commentStore.removeComment(editId)
		editId = null;
		showMenu()
	})
	return elt("div",{class: "commentMenu"},elt("ul",null,edit,reply,remove))
}

const placetext = {
	comment: "Enter your comment",
	insert: "Enter text to insert",
	replace: "Enter text to replace",
	delete: "Enter optional delete comment "
}

function setPlaceholderText(text) {
	let mode = commentsNode.querySelector("input[name=mode]:checked")
	let modevalue = mode? mode.value : "comment"
	text.placeholder = placetext[modevalue]
}

function getAddComment() {
	let addComment
	let addButton = elt("span",{class: "comment-button"},"Add Comment")
	let cancelButton = elt("span",{class: "comment-button"},"Cancel")
	let textArea = 	elt("textarea",{id:"textcomment",placeholder: "Enter comment (N/A for delete)"})
	addButton.addEventListener("click", e => {
		let modevalue = "comment"
		if (suggestMode) {
			let mode = commentsNode.querySelector("input[name=mode]:checked")
			modevalue = mode? mode.value : "comment"
		}
		if (textArea.value == '' && modevalue != "delete") {
			textArea.placeholder = "Text is required for "+modevalue
			return
		}
		addComment.className = "addComment hide"
		commentStore.createComment(textArea.value, modevalue)
	})
	cancelButton.addEventListener("click", e => { addComment.className = "addComment hide" })
	let commentMode = elt("span",null,elt("input",{type: "radio",name: "mode",value: "comment",checked: "checked"}),"comment")
	let modes = ["insert","replace","delete"].map(s => {
		return elt("span",null,elt("input",{type: "radio",name: "mode",value: s}),s)
	})
	if (suggestMode) {
		let modesPanel = elt("div",{class: "mode"},commentMode,modes)
		modesPanel.addEventListener("click", e => setPlaceholderText(textArea))
		return addComment = elt("div",{class: "addComment hide", id: "addcomment"},textArea,modesPanel,addButton,cancelButton)
	} else
		return addComment = elt("div",{class: "addComment hide", id: "addcomment"},textArea,addButton,cancelButton)		
}

export function initComments(pm,suggest = false) {
	commentStore = new CommentStore(pm,0)
	eventMixin(CommentStore)
	suggestMode = suggest
	commentsNode.innerHTML = ''
	onResize(pm.wrapper, () => { commentStore.reflow() })
	commentMenu = getCommentMenu()
	let addComment = getAddComment()
	let commentHeader = elt("div",{class: "comment-header"}, elt("span",null,"Comments"))
	commentsNode.addEventListener("click", e => {
		commentMenu.className = "commentMenu"
		editId = null
	})

	commentsNode.appendChild(commentHeader)
	commentsNode.appendChild(commentMenu)
	commentsNode.appendChild(addComment)
}

export class CommentStore {
	constructor(pm) {
		pm.mod.comments = this
		this.pm = pm
		this.comments = Object.create(null)
		this.unsent = []
		this.highlight = null
	}
    createComment(text,mode) {
        let id = getID()
        let sel = this.pm.selection
        this.addComment(sel.from, sel.to, text, id, mode)
        this.unsent.push({ type: "create", id: id })
        this.signal("mustSend")
    }
    addComment(from, to, text, id, mode) {
    	if (!comments[id]) {
    		if (from == to) to = from+1
    		let range = pm.markRange(from, to, { className: "mode-"+mode})
    		comments[id] = new Comment(id, text, range, mode)
    		commentsNode.appendChild(comments[id].newDom)
    		//HACK: give time for comment to be added
    		window.setTimeout(() => {
        		this.reflow()
        		this.highlightComment(id)
    		},150)
    	}
    }
    removeComment(id) {
    	let found = comments[id];
    	if (!found) return false
		this.clearHighlight()
		if (found.range) pm.removeRange(found.range)
		delete comments[id]
		commentsNode.removeChild(found.dom)
		this.reflow()
    }
    approveComment(id) {
    	let found = comments[id]
    	if (!found) return
    	switch (found.mode) {
	    	case "insert":
	    		pm.tr.insert(found.range.from,pm.schema.text(found.text)).apply(pm.apply.scroll)
	    		break
	    	case "delete":
	    		pm.tr.delete(found.range.from,found.range.to).apply(pm.apply.scroll)
	    		break
	    	case "replace":
	    		pm.tr.replaceWith(found.range.from,found.range.to,pm.schema.text(found.text)).apply(pm.apply.scroll)
	    		break
    	}
    	this.removeComment(id)
    }
    clearComments() {
    	comments.forEach(c=> { commentsNode.removeChild(c.dom) })
    }
    renderComments() {
    	comments.forEach(c=> { commentsNode.appendChild(c.newDom) })
    	this.reflow()
    }
    reflow() {
    	let r = pm.content.getBoundingClientRect()
    	let sorted = []
        Object.keys(comments).forEach(id => {
        	let c = comments[id]
         	let top = Math.round(pm.coordsAtPos(c.range.from).top-r.top+10)
        	sorted.push({dom:c.dom,top,h:c.height})
    	})
    	sorted.sort((a, b) => a.top - b.top)
    	let bottom = 20
    	sorted.forEach(r => {
    		let top = r.top
    		if(top < bottom) top = bottom
    		r.dom.style.top = top+"px"
    		bottom = top + r.h + 1
    	})
	}
	highlightComment(id) {
		let c = comments[id]
		if (!c) return
	    this.clearHighlight();
	    c.dom.className += " select"
	    this.highlight = c
    	let {from, to} = c.range
    	pm.removeRange(c.range)
    	c.range = pm.markRange(from, to, { className: c.getRangeClass(true)})
	}
	clearHighlight() {
	    if (this.highlight) {
	    	let c = this.highlight
	    	c.dom.className = "comment"
	    	if (c.range) {
		    	let r = c.range
		    	let {from,to} = r
		    	pm.removeRange(r)
	    		c.range = pm.markRange(from, to, { className: c.getRangeClass(false)})
	    	}
	        this.highlight = null;
	    }
	}
	getSelectionTop() {
		let {from} = pm.selection
		let r = pm.coordsAtPos(from)
		let rect = pm.content.getBoundingClientRect()
		return Math.round(r.top - rect.top)
	}
}

insertCSS(`
.comments {
	display: block;
	margin: 0 auto;
	width: 100%;
	height: 400px;
}

.comments .peer .ProseMirror-menubar {
	text-align: right;
}

.comments #editor {
	float: left;
	width: 70%;
	height: 100%;
}

.comments #comments {
	border: 1px solid #AAA;
	margin-left: 1px;
	padding: 0;
	height: 100%;
	width: 300px;
	display: inline-block;
	overflow-y: auto;
	position:relative;
 }


.comments .comment-header {
	font-weight: bold;
	font-size: 80%;
	width: 100%;
	background: skyblue;
	color: white;
	margin: 0;
	padding: 2px 2px 0px 2px;
	border-bottom: 1px solid #AAA;
	display: inline-block;
}
 
.comments .newcomment {
	margin-left: 10px;
	display: inline-block;
}

.comments .newcomment a {
	padding: 0 4px 0 4px;
	background: skyblue;
	color: white;
	text-decoration: none;
}

.comments .newcomment a:hover {
	padding: 0 4px 0 4px;
	background: white;
	color: skyblue;
	cursor: pointer;
}

.comments .comment {
	background: white;
	border-radius: 6px;
	border: 1px solid #AAA;
	width: 92%;
	font-size: 90%;
	padding: 4px;
	min-height: 30px;
	position: absolute;	
	left: 8px;
}

.comments .comment:after {
	content: ' ';
	height: 0;
	position: absolute;
	width: 0;
	border: 8px solid transparent;
	border-right-color: skyblue;
	left: -16px;
	top: 5px;
}

.comments .comment:hover {
	background-image: url('icons/menu.png');
	background-repeat: no-repeat;
	background-position: top right;
	cursor: pointer;
}

.comments .select {
	border: 1px solid skyblue;
}

.comment-button {
	margin: 4px;
	padding: 2px;
	border-radius: 4px;
	border: 1px solid #AAA;
	background: skyblue;
	color: white;
	cursor: pointer;
}

.addComment {
	background: white;
	margin: 2px;
	border-radius: 6px;
	border: 1px solid #AAA;
	visibility: visible;
	font-size: 80%;
	padding: 4px;
	display: inline-block;
	position: absolute;
	left: 0;
	width: 93%;
	z-index: 100;
}

.addComment textarea {
	width: 95%;
	resize: none;
	margin: 4px;
}

.mode-comment {
	background: skyblue;
}


.mode-comment-select {
	background: dodgerblue;
	color: white;
}

.mode-delete {
	text-decoration: line-through;
}

.mode-delete-select {
	text-decoration: line-through;
	background: tomato;
}

.mode-insert:before {
	content: "^";
	font-width: bold;
}

.mode-insert-select:before {
	content: "^";
	background: turquoise;
}

.mode-replace {
	text-decoration: overline;
}

.mode-replace-select {
	text-decoration: overline;
	background: violet;
}

.commentMenu {
	font-size: 90%;
	border: 1px solid #AAA;
	display: none;
	position:relative;
	left: 180px;
	width: 60px;
	z-index: 100;
	cursor: pointer;
}

.commentMenu ul {
	display: block;
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: white;
}

.commentMenu li {
}

.commentMenu li span {
    display: inline-block;
    color: black;
    padding: 1px;
    text-decoration: none;
}

.commentMenu li span:hover {
    background: skyblue;
	color: white;
}

.hide, .approval, .mode {
	display: none;
}

.show {
	display: block;
}

.approval, .mode {
	display: block;
	font-size: 85%;
	margin: 4px;
}

.approval span:first-child:after {
	content: "?";
	display: inline-block;
	font-weight: bold;
}

`)