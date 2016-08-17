import React from 'react'
import {Editor, EditorState} from 'draft-js';
import {cyan50} from 'material-ui/styles/colors'
import './DraftEditor.css';

class DraftEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
    this.onChange = (editorState) => this.setState({editorState});
  }
  render() {
    const {editorState} = this.state;
    return <Editor editorState={editorState} onChange={this.onChange} />;
  }
}

export default DraftEditor;