import {Block, Attribute} from "prosemirror/dist/model"
import {elt,insertCSS} from "prosemirror/dist/util/dom"
import {defParser, defParamsClick, selectedNodeAttr, getID} from "../../utils"
import {insertWidget} from "./index"

const css = "widgets-graph"
	
const graphs = ["graphs/line.json","graphs/column.json","graphs/pie.json","graphs/gantt.json","maps/map.json"]
                
function getFileData(url,f) {
	let xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
	    if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
	    	f(xmlhttp.responseText)
	}
	xmlhttp.open("GET", url, true)
	xmlhttp.send()
}

function makeGraph(id,url) {
	getFileData(url,data => {
		let graph = JSON.parse(data)
		if (graph.type == "map")
			getFileData("maps/"+graph.dataProvider.map+".js", script => {
                eval.apply(window, [script]);
				AmCharts.makeChart(id, graph)
			})
		else
			AmCharts.makeChart(id, graph)
	})
}

function getGraphOptions() {
	return graphs.map(w => ({value: w, label: w}))
}
 

export class Graph extends Block {
	serializeDOM(node,s){
		if (node.rendered) {
			node.rendered = node.rendered.cloneNode(true)
		} else {
			let id = getID()
			node.rendered = elt("div", {
				class: css+" widgets-graph-"+node.attrs.size, 
				id: id
			})
			makeGraph(id,node.attrs.data)
		}
		return node.rendered; 
	}	
	get attrs() {
		return {
			data: new Attribute({default: ""}),
			size: new Attribute({default: "medium"})
		}
	}
}

defParser(Graph,"div",css)

Graph.register("command", "insert", {
	label: "Graph",
	run(pm, data, size) {
		let {from,to,node} = pm.selection
		console.log(data,size)
		if (node && node.type == this) {
			let tr = pm.tr.setNodeType(from, this, {data,size}).apply()
			return tr
		} else
			return insertWidget(pm,from,this.create({data,size}))
	},
	select(pm) {
  		return true
	},
	menu: {group: "content", rank: 74, display: {type: "label", label: "Graph/Map"}},
	params: [
      	{ name: "Data URL", attr: "data", label: "Data URL", type: "select", 
      	  prefill: function(pm) { return selectedNodeAttr(pm, this, "data") },
  		  options: function() { return getGraphOptions()}
      	},
      	{ name: "Size", attr: "size", label: "Size", type: "select", default: "medium",
	      	  prefill: function(pm) { return selectedNodeAttr(pm, this, "size") },
        	  options: [
        	      {value: "small", label:"small"},
    	      	  {value: "medium", label:"medium"},
    	      	  {value: "large", label:"large"}
        	  ]
	    }
    ]
})

defParamsClick(Graph,"graph:insert")

insertCSS(`

.ProseMirror .{css} {}

.${css}-small {
	border-radius: 6px;
	border: 1px solid #DDD;
	width: 400px;
    height: 300px;
	display: inline-block;
}

.${css}-medium {
	border-radius: 6px;
	border: 1px solid #DDD;
	width: 600px;
    height: 400px;
	display: inline-block;
}

.${css}-large {
	border-radius: 6px;
	border: 1px solid #DDD;
	width: 800px;
    height: 600px;
	display: inline-block;
}

`)