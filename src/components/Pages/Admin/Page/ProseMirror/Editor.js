import React from 'react'
import {ProseMirror} from "prosemirror/dist/edit"
import {defineFileHandler} from "./utils"
import {schema} from "./schema" 
 
import {exampleSetup, buildMenuItems} from './example-setup'
 
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
// import "prosemirror/dist/menu/toolt`ipmenu"

const Editor = () => ({
  
  componentDidMount(){
    var contentWrapper = document.createElement('div');
    contentWrapper.innerHTML = this.props.initContent;

    let menu = buildMenuItems(schema);

    let pm = window.pm = new ProseMirror({
      place: document.getElementById('editor-root'),
      // menuBar: mainMenuBar,
      plugins: [
        exampleSetup.config({
          menuBar: {float: true, content: menu.fullMenu},
          tooltipMenu: true
        })
      ],
      schema: schema,
      // commands: commands,
      doc: schema.parseDOM(contentWrapper),
      // docFormat: "dom"
    })



    // pm.setOption("tooltipMenu", {
    //   selectedBlockMenu: true,
    //   inlineContent: [inlineGroup,insertMenu],
    //   blockContent: [[blockGroup, textblockMenu,alignGroup], [contentInsertMenu, questionInsertMenu]],
    // })

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