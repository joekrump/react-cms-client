export {BlockMath} from "./blockmath"
export {Image} from "./image"
export {SpreadSheet} from "./spreadsheet"
import {Block} from "prosemirror/dist/model"

if (window.MathJax)
	MathJax.Hub.Queue(function () {
	    MathJax.Hub.Config({
	    	tex2jax: {
	        	displayMath: [ ["\\[","\\]"] ], 
	        	inlineMath: [ ["\\(","\\)"] ],
	        	processEscapes: true
	    	},
	    	displayAlign:"left"
		})
	})

function getBlockPos(pm,$pos) {
	for (let i = $pos.depth; i > 0; i--)
		if ($pos.node(i).type instanceof Block) return $pos.end(i)
	return $pos.end(0)	
}

export function insertWidget(pm, pos, w) {
	let $pos = pm.doc.resolve(pos)
	return pm.tr.insert(getBlockPos(pm,$pos),w).apply(pm.apply.scroll)
}

