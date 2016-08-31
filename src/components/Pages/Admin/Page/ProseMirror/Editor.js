import React from 'react'
import {ProseMirror} from "prosemirror/dist/edit"
import "prosemirror/dist/menu/tooltipmenu"
import "prosemirror/dist/menu/menubar"
import {defineFileHandler} from "./utils"
import {widgetSchema, commands, mainMenuBar} from "./schema" 
 

 
/*
pm.setOption("tooltipMenu", {
  selectedBlockMenu: true,
  inlineContent: [inlineGroup,insertMenu],
  blockContent: [[blockGroup, textblockMenu,alignGroup], [contentInsertMenu, questionInsertMenu]],
})*/
  
defineFileHandler(function(files) {
  console.log(files)
})

// import prosemirror from "prosemirror"
// import BasicSchema from "prosemirror/dist/schema-basic"
// import "prosemirror/dist/menu/tooltipmenu"

const Editor = () => ({
  
  componentDidMount(){
    var contentWrapper = document.createElement('div');
    contentWrapper.innerHTML = this.props.initContent;

    let pm = window.pm = new ProseMirror({
      place: document.querySelector("#editor"),
      menuBar: mainMenuBar,
      schema: widgetSchema,
      commands: commands,
      doc: contentWrapper,
      docFormat: "dom"
    })

    // var editor = new prosemirror.ProseMirror({
    //   place: document.getElementById('editor-root'),
    //   schema: BasicSchema.schema,
    //   doc: BasicSchema.schema.parseDOM(contentWrapper)
    // })
  },
  render() {
    return (
      <div id="editor-root">
      </div>
    )
    
  }
});

export default Editor;