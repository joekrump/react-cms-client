import React from 'react'
// import DraftEditor from '../../../Editor/DraftEditor'
// import {RichEditor} from 'draft-note-editor'

// import '../../../Editor/css/Draft.css';
// import '../../../Editor/css/RichEditor.css';

import prosemirror from "prosemirror"
import BasicSchema from "prosemirror/dist/schema-basic"
import "prosemirror/dist/menu/tooltipmenu"

const Editor = () => ({
  
  componentDidMount(){
    var contentWrapper = document.createElement('div');
    contentWrapper.innerHTML = this.props.initContent;

    var editor = new prosemirror.ProseMirror({
      place: document.getElementById('editor-root'),
      schema: BasicSchema.schema,
      doc: BasicSchema.schema.parseDOM(contentWrapper)
    })
  },
  render() {
    return (
      <div id="editor-root">
      </div>
    )
    
  }
});

export default Editor;