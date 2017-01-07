import React from 'react';
import { connect } from 'react-redux';
import Chip from 'material-ui/Chip';
import { indigo900, indigo300 } from 'material-ui/styles/colors';
import { updateResource } from '../../../../../redux/actions/admin'

const styles = {
  chip: {
    margin: '0 6px',
    display: 'inline-block', 
  },
};

export class DraftLabel extends React.Component {

  render() {
    return (
      <Chip
        backgroundColor={this.props.isDraft ? indigo300 : indigo900}
        labelColor="white"
        onTouchTap={() => this.props.updateDraftState(this.props.pluralName)}
        style={styles.chip}
      >
        {this.props.isDraft ? 'Draft' : 'Published'}
      </Chip>
    );
  }
}

function mapStateToProps(state) {
  return {
    pluralName: state.admin.resource.name.plural
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    updateDraftState: (pluralName) => {
      dispatch(updateResource(pluralName, {draft: !ownProps.isDraft}, ownProps.resourceId))
    },
    dispatch
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DraftLabel)
