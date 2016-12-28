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

    this.state = {
      draft: this.props.draft
    }
  }

  toggleDraftStatus() {
    this.setState({
      draft: !this.state.draft
    })
    // Todo: toggle the draft value for this item.
  }



  render() {
    return (
      <Chip
        backgroundColor={this.state.draft ? indigo300 : indigo900}
        labelColor="white"
        onTouchTap={() => this.toggleDraftStatus()}
        style={styles.chip}
      >
        {this.state.draft ? 'Draft' : 'Published'}
      </Chip>
    );
  }
}


