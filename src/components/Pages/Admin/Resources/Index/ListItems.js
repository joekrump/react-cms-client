import React from 'react';
import IndexItem from './IndexItem';
import { connect } from 'react-redux';

class ListItems extends React.Component {

  render() {
    let items = this.props.childNodes.map((childNode) => (
      <IndexItem 
        key={`${this.props.resourceType}-${childNode.id}`}
        modelId={childNode.id}
        resourceType={this.props.resourceType}
        isEditing={this.props.isEditing}
        {...childNode}
      />
    ))

    return (
      <div className="root nested" data-parentModelId={-1}>
        {items}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isEditing: (state.admin.resources[state.admin.resource.name.plural].mode === 'EDIT_INDEX')
  }
}

export default connect(mapStateToProps, null)(ListItems)