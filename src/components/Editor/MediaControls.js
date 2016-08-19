import React from 'react';
import StyleButton from './StyleButton';

const styles = {
  controls: {
    fontFamily: '\'Helvetica\', sans-serif',
    fontSize: 14,
    marginBottom: 10,
    userSelect: 'none',
  },
  styleButton: {
    border: 0
  },
}

const MediaControls = (props) => ({
  // currentStyle = props.editorState.getCurrentInlineStyle();
  handleImageClick(e) {
    e.preventDefault();
    console.log('image clicked')
    props.imageClickCallback(e)
  },

  handleIAudioClick(e) {
    e.preventDefault();
    props.audioClickCallback(e)
  },

  handleVideoClick(e) {
    e.preventDefault();
    props.videoClickCallback(e)
  },

  render() {
    return (
      <div style={styles.controls}>
        <button
          className="RichEditor-styleButton"
          style={styles.styleButton}
          onMouseDown={this.handleImageClick}
        >Add Image</button>
        <button
          className="RichEditor-styleButton"
          style={styles.styleButton}
          onMouseDown={this.handleIAudioClick}
        >Add Audio</button>
        <button
          className="RichEditor-styleButton"
          style={styles.styleButton}
          onMouseDown={this.handleVideoClick}
        >Add Video</button>
      </div>
    );
  }

});

export default MediaControls;