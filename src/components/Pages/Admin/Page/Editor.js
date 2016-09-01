import React from 'react'
import Quill from 'quill'
 
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
  },
  render() {
    return (
      <div id="editor-root">
        
      </div>
    )
    
  }
});

export default Editor;