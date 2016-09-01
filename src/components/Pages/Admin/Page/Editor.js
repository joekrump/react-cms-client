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
// import './quill.core.css'
import './quill.bubble.css'

const Editor = () => ({
  
  componentDidMount(){
    var contentWrapper = document.createElement('div');
    contentWrapper.innerHTML = this.props.initContent;

    var options = {
      modules: {
        toolbar: [
          [{ 'header': 1 }, { 'header': 2 }],               // custom button values
          ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
          ['blockquote', 'code-block'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'align': [] }],
          ['link', 'image']
        ]
      },
      placeholder: 'Compose an epic...',
      theme: 'bubble'
    };

    var editor = new Quill('#editor-root', options);

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