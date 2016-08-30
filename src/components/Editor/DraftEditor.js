import React from 'react'
import {AtomicBlockUtils,
        convertFromHTML,
        convertFromRaw,
        convertToRaw,
        CompositeDecorator,
        ContentState,
        DefaultDraftBlockRenderMap,
        Editor,
        EditorState,
        Entity,
        getDefaultKeyBinding, 
        KeyBindingUtil,
        Modifier,
        RichUtils} from 'draft-js';

import {cyan50} from 'material-ui/styles/colors'
import BlockStyleControls from './BlockStyleControls';
import InlineStyleControls from './InlineStyleControls';
import ColorControls from './ColorControls';
import MediaControls from './MediaControls';
import MediaEntity from './MediaEntity'
import {stateToHTML} from 'draft-js-export-html';

import './css/Draft.css';
import './css/DraftEditor.css';

const {hasCommandModifier} = KeyBindingUtil;

const rawContent = {
  blocks: [
    {
      text: (
        'This is an "immutable" entity: Superman. Deleting any ' +
        'characters will delete the entire entity. Adding characters ' +
        'will remove the entity from the range.'
      ),
      type: 'unstyled',
      entityRanges: [{offset: 31, length: 8, key: 'first'}],
    },
    {
      text: '',
      type: 'unstyled',
    },
    {
      text: (
        'This is a "mutable" entity: Batman. Characters may be added ' +
        'and removed.'
      ),
      type: 'unstyled',
      entityRanges: [{offset: 28, length: 6, key: 'second'}],
    },
    {
      text: '',
      type: 'unstyled',
    },
    {
      text: (
        'This is a "segmented" entity: Green Lantern. Deleting any ' +
        'characters will delete the current "segment" from the range. ' +
        'Adding characters will remove the entire entity from the range.'
      ),
      type: 'unstyled',
      entityRanges: [{offset: 30, length: 13, key: 'third'}],
    },
  ],

  entityMap: {
    first: {
      type: 'TOKEN',
      mutability: 'IMMUTABLE',
    },
    second: {
      type: 'TOKEN',
      mutability: 'MUTABLE',
    },
    third: {
      type: 'TOKEN',
      mutability: 'SEGMENTED',
    },
  },
};

const dummyHTMLcontent = '<h1 style="color:blue;">Testing</h1>'

class DraftEditor extends React.Component {
  constructor(props) {
    super(props);

    const decorator = new CompositeDecorator([
      {
        strategy: getEntityStrategy('IMMUTABLE'),
        component: TokenSpan,
      },
      {
        strategy: getEntityStrategy('MUTABLE'),
        component: TokenSpan,
      },
      {
        strategy: getEntityStrategy('SEGMENTED'),
        component: TokenSpan,
      },
    ]);

    const blocks = convertFromRaw(rawContent);
    // const blocks = convertFromHTML(dummyHTMLcontent);

    this.state = {
      editorState: EditorState.createWithContent(blocks, decorator),
      showURLInput: false,
      url: '',
      urlType: '',
    };

    this.focus = () => this.refs.editor.focus();
    this.onChange = (editorState) => this.setState({editorState});
    this.logState = () => {
      const content = this.state.editorState.getCurrentContent();
      console.log(convertToRaw(content));
    };
    this.onURLChange = (e) => this.setState({urlValue: e.target.value});
    this.addAudio = this._addAudio.bind(this);
    this.addImage = this._addImage.bind(this);
    this.addVideo = this._addVideo.bind(this);
    this.confirmMedia = this._confirmMedia.bind(this);
    this.handleKeyCommand = this._handleKeyCommand.bind(this);
    this.onURLInputKeyDown = this._onURLInputKeyDown.bind(this);
    this.toggleBlockType = (type) => this._toggleBlockType(type);
    this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
    this.toggleColor = (toggledColor) => this._toggleColor(toggledColor);

    // Image processing
    this.handleFileInput = (e) => this._handleFileInput(e);
    this.insertImage = (file) => this._insertImage(file);
    this.removeSelected = (entityKey) => this._removeSelected(entityKey);
  }

  _toggleColor(toggledColor) {
    const {editorState} = this.state;
    const selection = editorState.getSelection();

    // Let's just allow one color at a time. Turn off all active colors.
    const nextContentState = Object.keys(colorStyleMap)
      .reduce((contentState, color) => {
        return Modifier.removeInlineStyle(contentState, selection, color)
      }, editorState.getCurrentContent());

    let nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      'change-inline-style'
    );

    const currentStyle = editorState.getCurrentInlineStyle();

    // Unset style override for current color.
    if (selection.isCollapsed()) {
      nextEditorState = currentStyle.reduce((state, color) => {
        return RichUtils.toggleInlineStyle(state, color);
      }, nextEditorState);
    }

    // If the color is being toggled on, apply it.
    if (!currentStyle.has(toggledColor)) {
      nextEditorState = RichUtils.toggleInlineStyle(
        nextEditorState,
        toggledColor
      );
    }

    this.onChange(nextEditorState);
  }


  _handleKeyCommand(command: string): DraftHandleValue {
    if (command === 'myeditor-save') {
      // Perform a request to save your contents, set
      // a new `editorState`, etc.
      // 
      let options = {
        inlineStyles: {
          TOKEN: {style: styles.immutable},
        },
        blockRenderers: {
          atomic: (block) => {
            const entity = Entity.get(block.getEntityAt(0));
            const type = entity.getType();
            if(type === 'image') {
              let entityData = entity.getData();
              console.log(entityData)
              const { src } = entityData; 
              return '<img src="'+ src +'"/>';
            }
          },
        },
      }
      console.log('handled save')
      let contentNode = document.getElementsByClassName('public-DraftEditor-content')[0];
      console.log(contentNode.firstElementChild.innerHTML);
      this.logState();
      console.log(stateToHTML(this.state.editorState.getCurrentContent(), options))
      return 'handled';
    }
    const {editorState} = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  _confirmMedia(e) {
    e.preventDefault();
    const {editorState, urlValue, urlType} = this.state;
    const entityKey = Entity.create(urlType, 'IMMUTABLE', {src: urlValue})

    this.setState({
      editorState: AtomicBlockUtils.insertAtomicBlock(
        editorState,
        entityKey,
        ' '
      ),
      showURLInput: false,
      urlValue: '',
    }, () => {
      setTimeout(() => this.focus(), 0);
    });
  }

  _onURLInputKeyDown(e) {
    if (e.which === 13) {
      this._confirmMedia(e);
    }
  }

  _promptForMedia(type) {
    this.setState({
      showURLInput: true,
      urlValue: '',
      urlType: type,
    }, () => {
      setTimeout(() => this.refs.url.focus(), 0);
    });
  }

  _addAudio() {
    this._promptForMedia('audio');
  }

  _insertImage(file) {
    const defaultWidthHeight = 10;

    const {editorState, urlValue, urlType} = this.state;
    const entityKey = Entity.create('image', 'IMMUTABLE', {
      src: URL.createObjectURL(file), 
      removeCallback: this.removeSelected, 
      width: defaultWidthHeight, 
      height: defaultWidthHeight,
      alignment: 'left'
    })

    this.setState({
      editorState: AtomicBlockUtils.insertAtomicBlock(
        editorState,
        entityKey,
        ' '
      ),
      showURLInput: false,
      urlValue: '',
    }, () => {
      setTimeout(() => this.focus(), 0);
    });
  }

  _removeSelected(entityKey){
    console.log('WIP: REMOVE entity with key: ', entityKey)
    // const {editorState} = this.state;
    // const currentContent = editorState.getCurrentContent();
    // console.log('block map', editorState.getCurrentContent().getBlockMap());
    // console.log('Block for Key ', editorState.getCurrentContent().getBlockForKey(entityKey))
    // console.log('Selection state', editorState.getSelection());
    // let newContentState = Modifier.removeRange (
    //   currentContent,
    //   editorState.getSelection(),
    //   'backward'
    // )

    // console.log('new content state: ', newContentState.getBlockForKey(entityKey))
    // this.setState({
    //   editorState: Modifier.applyEntity(
    //     editorState,
    //     editorState.getSelection(),
    //     entityKey
    //   )
    // })
  }

  _handleFileInput(e) {
    const fileList = e.target.files;
    if(fileList.length > 0) {
      // this.insertImage(fileList[0]);
      console.log(fileList)
      Object.keys(fileList).map((key) => {
        // console.log(key);
        this.insertImage(fileList[key]);
      })
    }
  }

  _addImage() {
    this.refs.fileInput.click();
  }

  _addVideo() {
    this._promptForMedia('video');
  }

  _toggleBlockType(blockType) {
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  }

  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  }

  render() {
    const {editorState} = this.state;

    let urlInput;
    let editorClassName = 'RichEditor-editor';

    var contentState = editorState.getCurrentContent();
     if (!contentState.hasText()) {
       if (contentState.getBlockMap().first().getType() !== 'unstyled') {
         editorClassName += ' RichEditor-hidePlaceholder';
       }
     }

    if (this.state.showURLInput) {
      urlInput =
        <div style={styles.urlInputContainer}>
          <input
            onChange={this.onURLChange}
            ref="url"
            style={styles.urlInput}
            type="text"
            placeholder="Enter URL"
            value={this.state.urlValue}
            onKeyDown={this.onURLInputKeyDown}
          />
          <button onMouseDown={this.confirmMedia}>
            Confirm
          </button>
        </div>;
    }

    return (
      <div style={styles.root}>
        <BlockStyleControls
           editorState={editorState}
           onToggle={this.toggleBlockType}
        />
        <InlineStyleControls
          editorState={editorState}
          onToggle={this.toggleInlineStyle}
        />
        <ColorControls
          editorState={editorState}
          onToggle={this.toggleColor}
        />
        <MediaControls
          imageClickCallback={this.addImage}
          audioClickCallback={this.addAudio}
          videoClickCallback={this.addVideo}
          editorState={editorState}
          onToggle={this.toggleInlineStyle}
        />
        {urlInput}
        <div className={editorClassName} onClick={this.focus}>
          <Editor
            blockRendererFn={mediaBlockRenderer}
            blockStyleFn={myBlockStyleFn}
            customStyleMap={{...styleMap, ...colorStyleMap}}
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            keyBindingFn={myKeyBindingFn}
            onChange={this.onChange}
            placeholder="Enter some text..."
            ref="editor"
            spellCheck={true}
          />
          <input type="file" 
                 ref="fileInput" 
                 style={{display: 'none'}}
                 onChange={this.handleFileInput} 
                 multiple/>
        </div>
        <input
          onClick={this.logState}
          style={styles.button}
          type="button"
          value="Log State"
        />
      </div>
    );
  }
}

function mediaBlockRenderer(block) {
  if (block.getType() === 'atomic') {
    return {
      component: MediaEntity,
      editable: false,
    };
  }

  return null;
}

// The blockStyleFn prop on Editor allows you to define CSS classes 
// to style blocks at render time. For instance, you may wish to style 
// 'blockquote' type blocks with fancy italic text.
function myBlockStyleFn(contentBlock) {
  const type = contentBlock.getType();
  if (type === 'blockquote') {
    return 'superFancyBlockquote';
  }
}


function myKeyBindingFn(e: SyntheticKeyboardEvent): string {
  if (e.keyCode === 83 /* `S` key */ && hasCommandModifier(e)) {
    return 'myeditor-save';
  }
  return getDefaultKeyBinding(e);
}

function getEntityStrategy(mutability) {
  return function(contentBlock, callback) {
    contentBlock.findEntityRanges(
      (character) => {
        const entityKey = character.getEntity();
        if (entityKey === null) {
          return false;
        }
        return Entity.get(entityKey).getMutability() === mutability;
      },
      callback
    );
  };
}

function getDecoratedStyle(mutability) {
  switch (mutability) {
    case 'IMMUTABLE': return styles.immutable;
    case 'MUTABLE': return styles.mutable;
    case 'SEGMENTED': return styles.segmented;
    default: return null;
  }
}

const TokenSpan = (props) => {
  const style = getDecoratedStyle(
    Entity.get(props.entityKey).getMutability()
  );
  return (
    <span {...props} style={style}>
      {props.children}
    </span>
  );
};

const styleMap = {
  'STRIKETHROUGH': {
    textDecoration: 'line-through',
  },
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
    color: 'blue'
  }
}

const colorStyleMap = {
  red: {
    color: 'rgba(255, 0, 0, 1.0)',
  },
  orange: {
    color: 'rgba(255, 127, 0, 1.0)',
  },
  yellow: {
    color: 'rgba(180, 180, 0, 1.0)',
  },
  green: {
    color: 'rgba(0, 180, 0, 1.0)',
  },
  blue: {
    color: 'rgba(0, 0, 255, 1.0)',
  },
  indigo: {
    color: 'rgba(75, 0, 130, 1.0)',
  },
  violet: {
    color: 'rgba(127, 0, 255, 1.0)',
  },
}

const styles = {
  buttons: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    textAlign: 'center',
  },
  urlInputContainer: {
    marginBottom: 10,
  },
  urlInput: {
    fontFamily: '\'Georgia\', serif',
    marginRight: 10,
    padding: 3,
  },
  immutable: {
    padding: '2px 0',
    color: 'red'
  },
  mutable: {
    padding: '2px 0',
    color: 'yellow'
  },
  segmented: {
    padding: '2px 0',
    color: 'green'
  },
  button: {
    marginTop: 10,
    textAlign: 'center',
  }
};

export default DraftEditor;