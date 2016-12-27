import React from 'react';
import IndexItem from './IndexItem';
import { connect } from 'react-redux';

class ListItems extends React.Component {

  render() {
    let items = this.props.childNodes.map((childNode) => {
      childNode.depth = 1;
      return <IndexItem 
        key={`${this.props.resourceType}-${childNode.id}`}
        modelId={childNode.id}
        resourceType={this.props.resourceType}
        isEditing={this.props.isEditing}
        isParent={(childNode.child_ids && (childNode.child_ids.length > 0))}
        collapsed={true}
        {...childNode}
      />
    })

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