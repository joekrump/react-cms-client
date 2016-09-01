import Quill from 'quill'
let BlockEmbed = Quill.import('blots/block/embed');
var Link = Quill.import('formats/link');


class CustomImage extends BlockEmbed {
  static create(value) {
    let node = super.create(value);
    if (typeof value === 'string') {
      node.setAttribute('src', this.sanitize(value));
    }
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
CustomImage.tagName = 'img';


export default CustomImage;
