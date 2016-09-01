import Quill from 'quill'
let BlockEmbed = Quill.import('blots/block/embed');
var Link = Quill.import('formats/link');
import React from 'react';
import ImageEntity from '../../../../Editor/ImageEntity'
import ReactDOM from 'react-dom'
import muiTheme from '../../../../../muiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

const defaultWidthHeight = 10;
const style = {
  width: '100%'
}

class CustomImage extends BlockEmbed {
  static create(value) {
    let node = {};
    let editorContainer = document.getElementById('editor-root');
    let images = document.getElementsByClassName('ql-editor-image');
    let numImages = images.length;
    console.log(numImages)
    var component = ReactDOM.render(
      <MuiThemeProvider muiTheme={muiTheme}><ImageEntity src={this.sanitize(value)} 
                    className={'ql-editor-image image-' + numImages}
                    style={style} 
                    muiTheme={muiTheme}
                    maxWidth={editorContainer.clientWidth} 
                    maxHeight={window.innerHeight - 150} 
                    width={defaultWidthHeight} 
                    height={defaultWidthHeight} 
                  /></MuiThemeProvider>,
                  document.getElementById('editor-react-components'),
                  () => {
                    console.log('Callback count', document.getElementsByClassName('ql-editor-image'))
                    console.log(numImages);
                    var domNode = document.getElementsByClassName('image-' + numImages);
                    console.log(domNode)
                    if(domNode.length > 0) {
                      node = super.create(domNode[0]);
                    } else {
                      node = super.create('customimage');
                    }
                    
                  }
    )
    console.log('Post render count', document.getElementsByClassName('ql-editor-image'));
    // node.innerHTML();
    // if (typeof value === 'string') {
    //   node.setAttribute('src', this.sanitize(value));
    // }

    // console.log(<ImageEntity src={this.sanitize(value)} 
    //                 style={style} 
    //                 maxWidth={editorContainer.clientWidth} 
    //                 maxHeight={window.innerHeight - 150} 
    //                 width={defaultWidthHeight} 
    //                 height={defaultWidthHeight} 
    //               />)
    console.log(node);
    return node;
  }

  static formats(domNode) {
    let formats = {};
    if (domNode.hasAttribute('height')) formats['height'] = domNode.getAttribute('height');
    if (domNode.hasAttribute('width')) formats['width'] = domNode.getAttribute('width');
    return formats;
  }

  static match(url) {
    return /\.(jpe?g|gif|png)$/.test(url) || /^data:image\/.+;base64/.test(url);
  }

  static sanitize(url) {
    return Link.sanitize(url, ['http', 'https', 'data']) ? url : '//:0';
  }

  static value(domNode) {
    return domNode.getAttribute('src');
  }

  format(name, value) {
    if (name === 'height' || name === 'width') {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
}

CustomImage.blotName = 'customimage';
CustomImage.tagName = 'div';


export default CustomImage;
