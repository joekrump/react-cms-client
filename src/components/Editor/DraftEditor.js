import React from 'react'
import Editor from 'draft-js-editor'
import { EditorState, convertFromRaw, Entity } from 'draft-js'
import {cyan50} from 'material-ui/styles/colors'
import './DraftEditor.css';

const DraftEditor = React.createClass({

  getInitialState() {
    return {
      editorState: null
    }
  },
  handleFileInput(e){
    // This just converts e.target.files form a FileList to an Array
    var files = Array.prototype.slice.call(e.target.files, 0)
    files.forEach(function(file){
      this.insertFile(file);
      return;
    }.bind(this));
  },
  insertFile(file){
    var editor = this.refs['editor']
    var entityKey = editor.insertBlockComponent("image", {src: URL.createObjectURL(file)})
    
    // Do asynchronouse upload
    setTimeout(() => {
      var imgStyle = {}
      // Modify the appearance of the image, just for demo purposes
      imgStyle.filter = 'hue-rotate(180deg)'
      imgStyle.MozFilter = 'hue-rotate(180deg)'
      imgStyle.WebkitFilter = 'hue-rotate(180deg)'
      imgStyle.OFilter = 'hue-rotate(180deg)'
      imgStyle.MsFilter = 'hue-rotate(180deg)'
      var test = Entity.mergeData(entityKey, {
        // Would normally change the src attribute with the new url
        // but we'll just change the appearance for this demo
        style: imgStyle,
      })

      alert('Image updated, type a character to see the change.')
    }, 2000)

  },
  render() {
    return (
      <div>
        <Editor
          onImageClick={(e) => this.refs['fileInput'].click()}
          ref="editor"
          placeholder="Enter some content..." 
          iconColor={cyan50}
          editorState={this.state.editorState}
        />
        <input type="file" ref="fileInput" style={{display: 'none'}} 
                      onChange={Editor.handleFileInput} />
      </div>
    ) 
  }
})

export default DraftEditor;