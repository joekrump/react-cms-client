import React from 'react'

import Quill from 'quill'
 
/*
pm.setOption("tooltipMenu", {
  selectedBlockMenu: true,
  inlineContent: [inlineGroup,insertMenu],
  blockContent: [[blockGroup, textblockMenu,alignGroup], [contentInsertMenu, questionInsertMenu]],
})*/
  

// import prosemirror from "prosemirror"
// import BasicSchema from "prosemirror/dist/schema-basic"
// import "prosemirror/dist/menu/toolt`ipmenu"
import './quill.core.css'
import './quill.bubble.css'

const Editor = () => ({
  
  componentDidMount(){
    var contentWrapper = document.createElement('div');
    contentWrapper.innerHTML = this.props.initContent;

    var toolbarOptions = ['bold', 'italic', 'underline', 'strike'];

    var options = {
      debug: 'info',
      modules: {
        toolbar: toolbarOptions
      },
      placeholder: 'Compose an epic...',
      readOnly: false,
      theme: 'bubble'
    };

    var container = document.getElementById('editor-root');
    var editor = new Quill(container, options);

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