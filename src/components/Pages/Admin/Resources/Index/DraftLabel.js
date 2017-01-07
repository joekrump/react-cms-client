import React from 'react';
import Chip from 'material-ui/Chip';
import {indigo900, indigo300} from 'material-ui/styles/colors';

const styles = {
  chip: {
    margin: '0 6px',
    display: 'inline-block', 
  },
};

export default class Label extends React.Component {

  constructor(props) {
    super(props);
  }

  toggleDraftStatus() {
    // Todo: toggle the draft value for this item.
  }

  render() {
    return (
      <Chip
        backgroundColor={this.props.isDraft ? indigo300 : indigo900}
        labelColor="white"
        onTouchTap={() => this.toggleDraftStatus()}
        style={styles.chip}
      >
        {this.props.isDraft ? 'Draft' : 'Published'}
      </Chip>
    );
  }
}


