import React from 'react'
import Quill from './Quill/quill'
import Counter from './Quill/modules/Counter'
import CustomImage from './Quill/formats/CustomImage';
import Delta from 'rich-text/lib/delta';

import PhotoIcon from 'material-ui/svg-icons/editor/insert-photo'
import TitleIcon from 'material-ui/svg-icons/editor/title'
import BoldIcon from 'material-ui/svg-icons/editor/format-bold'
import ItalicIcon from 'material-ui/svg-icons/editor/format-italic'
import NumberListIcon from 'material-ui/svg-icons/editor/format-list-numbered'
import BulletListIcon from 'material-ui/svg-icons/editor/format-list-bulleted'
import LinkIcon from 'material-ui/svg-icons/editor/insert-link'
import AlignLeftIcon from 'material-ui/svg-icons/editor/format-align-left'
import AlignCenterIcon from 'material-ui/svg-icons/editor/format-align-center'
import AlignRightIcon from 'material-ui/svg-icons/editor/format-align-right'
import QuoteIcon from 'material-ui/svg-icons/editor/format-quote'

import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';

// Custom Theme
import HeroicTheme from './Quill/themes/heroic';

const buttonStyle = {
  width: '38px',
  height: '38px',
  padding: '5px'
}

// var Emitter = Quill.import('core/emitter')

import './Quill/dist/quill.heroic.css'
import './toolbar.css'

Quill.register({
  'modules/counter': Counter,
  'themes/heroic': HeroicTheme,
}, true);

Quill.register(CustomImage);

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
          // container: [
          //   [{ 'header': 1 }, { 'header': 2 }],               // custom button values
          //   ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
          //   ['blockquote', 'code-block'],
          //   [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          //   [{ 'align': [] }],
          //   ['link', 'image']
          // ],
          container: '#tooltip-controls',
          handlers: {
            link: function(value) {
              if (!value) {
                this.quill.format('link', false);
              } else {
                this.quill.theme.tooltip.edit();
              }
            }
          }
        }
      },
      placeholder: 'Compose an epic...',
      theme: 'heroic'
    };



    var editor = new Quill('#editor-root', options);

    // editor.on(Emitter.events.EDITOR_CHANGE, (type, range) => {
    //   if (type !== Emitter.events.SELECTION_CHANGE) return;
    //   if (range != null && range.length > 0) {
    //     this.show();
    //     // Lock our width so we will expand beyond our offsetParent boundaries
    //     this.root.style.left = '0px';
    //     this.root.style.width = '';
    //     this.root.style.width = this.root.offsetWidth + 'px';
    //     let lines = this.quill.scroll.lines(range.index, range.length);
    //     if (lines.length === 1) {
    //       this.position(this.quill.getBounds(range));
    //     } else {
    //       let lastLine = lines[lines.length - 1];
    //       let index = lastLine.offset(this.quill.scroll);
    //       let length = Math.min(lastLine.length() - 1, range.index + range.length - index);
    //       let bounds = this.quill.getBounds(new Range(index, length));
    //       this.position(bounds);
    //     }
    //   } else if (document.activeElement !== this.textbox && this.quill.hasFocus()) {
    //     this.hide();
    //   }
    // });

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
  handleToolTipOption(type) {
    
    let range = this.state.editor.getSelection();
    let formats = this.state.editor.getFormat(range);

    switch(type) {
      case "title1": 
        this.state.editor.format('header', 1)
        break;
      case "title2": 
        this.state.editor.format('header', 2)
        break;
      case "bold": 
        this.state.editor.format('bold', !formats.bold)
        break;
      case "italic": 
        this.state.editor.format('italic', true)
        break;
      case "quote": 
        this.state.editor.format('blockquote', true);
        break;
      case "n-list":
        this.state.editor.format('list', 'ordered');
        break;
      case "b-list":
        this.state.editor.format('list', 'bullet'); 
        break;
      case "align-left":
        console.log('align left');
        this.state.editor.format('align', false, Quill.sources.USER) 
        break;
      case "align-center": 
        this.state.editor.format('align', 'center')
        break;
      case "align-right": 
        this.state.editor.format('align', 'right')
        break;
      case "link": 
        // if (!value) {
        //   this.quill.format('link', false);
        // } else {
          this.state.editor.theme.tooltip.edit();
        // }
        break;
      case "image":
        let fileInput = this.state.editor.container.querySelector('input.ql-image[type=file]');
        if (fileInput == null) {
          fileInput = document.createElement('input');
          fileInput.setAttribute('type', 'file');
          fileInput.setAttribute('accept', 'image/*');
          fileInput.classList.add('ql-image');
          fileInput.addEventListener('change', () => {
            if (fileInput.files != null && fileInput.files[0] != null) {
              let reader = new FileReader();
              reader.onload = (e) => {
                let range = this.state.editor.getSelection(true);
                this.state.editor.updateContents(new Delta()
                  .retain(range.index)
                  .delete(range.length)
                  .insert({ customimage: e.target.result })
                , Quill.sources.USER);
                fileInput.value = "";
              }
              console.log(reader.readAsDataURL(fileInput.files[0]));
            }
          });
          this.state.editor.container.appendChild(fileInput);
        }
        fileInput.click();
        break;
      default:

    }
  },
  render() {
    return (
      <div>
        <IconButton onTouchTap={this.handleToolTipOption.bind(this, "image")} style={{...buttonStyle}} tooltip="Insert Image"><PhotoIcon style={{color: 'white'}}/></IconButton>
        <div id="editor-root"></div>
        <div id="tooltip-controls">
          <IconButton onTouchTap={this.handleToolTipOption.bind(this, "title1")} style={{...buttonStyle}} tooltip="Title"><TitleIcon style={{color: 'white'}}/><sub>1</sub></IconButton>
          <IconButton onTouchTap={this.handleToolTipOption.bind(this, "title2")} style={{...buttonStyle}} tooltip="Sub-title"><TitleIcon style={{color: 'white'}}/><sub>2</sub></IconButton>
          <IconButton onTouchTap={this.handleToolTipOption.bind(this, "bold")} style={{...buttonStyle}} tooltip="Bold"><BoldIcon style={{color: 'white'}}/></IconButton>
          <IconButton onTouchTap={this.handleToolTipOption.bind(this, "italic")} style={{...buttonStyle}} tooltip="Italic"><ItalicIcon style={{color: 'white'}}/></IconButton>
          <IconButton onTouchTap={this.handleToolTipOption.bind(this, "quote")} style={{...buttonStyle}} tooltip="Quote"><QuoteIcon style={{color: 'white'}}/></IconButton>
          <IconButton onTouchTap={this.handleToolTipOption.bind(this, "n-list")} style={{...buttonStyle}} tooltip="Numbered List"><NumberListIcon style={{color: 'white'}}/></IconButton>
          <IconButton onTouchTap={this.handleToolTipOption.bind(this, "b-list")} style={{...buttonStyle}} tooltip="Bullet List"><BulletListIcon style={{color: 'white'}}/></IconButton>
          <IconButton onTouchTap={this.handleToolTipOption.bind(this, "align-left")} style={{...buttonStyle}} tooltip="Align Left"><AlignLeftIcon style={{color: 'white'}}/></IconButton>
          <IconButton onTouchTap={this.handleToolTipOption.bind(this, "align-center")} style={{...buttonStyle}} tooltip="Align Center"><AlignCenterIcon style={{color: 'white'}}/></IconButton>
          <IconButton onTouchTap={this.handleToolTipOption.bind(this, "align-right")} style={{...buttonStyle}} tooltip="Align Right"><AlignRightIcon style={{color: 'white'}}/></IconButton>
          <IconButton onTouchTap={this.handleToolTipOption.bind(this, "link")} style={{...buttonStyle}} tooltip="Insert Link"><LinkIcon style={{color: 'white'}}/></IconButton>
        </div>
        <div id="counter">0</div>
        <div id="editor-react-components"></div>
      </div>
    )
  }
});

export default Editor;