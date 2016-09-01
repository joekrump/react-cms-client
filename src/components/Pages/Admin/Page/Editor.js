import React from 'react'
import Quill from 'quill'
 
import './quill.bubble.css'

const Editor = React.createClass({
  getInitialState(){
    return {
      editor: null
    }
  },
  componentDidMount(){
    var bindings = {
      saveContent: {
        key: 'S',
        shortKey: true,
        handler: this.props.handleSave 
      }
    }
    var options = {
      modules: {
        keyboard: {
          bindings: bindings
        },
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
    if(this.props.content) {
      editor.pasteHTML(this.props.content) // set initial content if there is some.
    }
    this.setState({
      editor: editor
    })
  },
  componentWillReceiveProps(newProps){
    console.log(newProps)
    if(newProps.content) {
      this.state.editor.pasteHTML(newProps.content) // set initial content if there is some.
      this.state.editor.focus();
    }
  },
  render() {
    return (
      <div id="editor-root">
        
      </div>
    )
    
  }
});

export default Editor;