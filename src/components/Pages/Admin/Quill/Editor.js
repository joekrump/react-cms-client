import React from 'react'
import Quill from 'quill'
import Counter from './modules/Counter'
import ResizableImage from './formats/ResizableImage';
import Icons from './ui/icons'
import Delta from 'rich-text/lib/delta';

import './quill.bubble.css'

Quill.register({
  'modules/counter': Counter,
  'formats/resizable-image': ResizableImage,
}, true);


const Editor = React.createClass({
  getInitialState(){
    return {
      editor: null
    }
  },
  getEditorHTML() {
    return this.state.editor.container.firstChild.innerHTML.replace(/\>\s+\</g, '>&nbsp;<')
  },
  componentDidMount(){
    var bindings = {
      saveContent: {
        key: 'S',
        shortKey: true,
        handler: () => {
          this.props.handleSave(this.getEditorHTML())
        }
      }
    }
    var options = {
      modules: {
        counter: {
          container: '#counter',
          unit: 'word'
        },
        keyboard: {
          bindings: bindings
        },
        toolbar: {
          container: [
            [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['link', 'resizable-image', 'image']
          ],
          handlers: {
            link: function(value) {
              if (!value) {
                this.quill.format('link', false);
              } else {
                this.quill.theme.tooltip.edit();
              }
            },
            'resizable-image': function(value) {
              let fileInput = this.container.querySelector('input.ql-image[type=file]');
              if (fileInput == null) {
                fileInput = document.createElement('input');
                fileInput.setAttribute('type', 'file');
                fileInput.setAttribute('accept', 'image/*');
                fileInput.classList.add('ql-image');
                fileInput.addEventListener('change', () => {
                  if (fileInput.files != null && fileInput.files[0] != null) {
                    let reader = new FileReader();
                    reader.onload = (e) => {
                      let range = this.quill.getSelection(true);
                      this.quill.updateContents(new Delta()
                        .retain(range.index)
                        .delete(range.length)
                        .insert({ image: e.target.result })
                      , Quill.sources.USER);
                      fileInput.value = "";
                    }
                    reader.readAsDataURL(fileInput.files[0]);
                  }
                });
                this.container.appendChild(fileInput);
              }
              fileInput.click();
            }
          }
        }
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
    if(newProps.content) {
      this.state.editor.pasteHTML(newProps.content) // set initial content if there is some.
      this.state.editor.focus();
    }
  },
  render() {
    return (
      <div>
        <div id="editor-root"></div>
        <div id="counter">0</div>
      </div>
    )
  }
});

export default Editor;