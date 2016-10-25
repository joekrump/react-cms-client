import React from 'react';
import IndexItem from './IndexItem';
import { connect } from 'react-redux';

const ListItems = (props) => {
  let items = props.childNodes.map((childNode) => (
    <IndexItem 
      key={`${props.resourceType}-${childNode.id}`}
      modelId={childNode.id}
      resourceType={props.resourceType}
      node={childNode}
      isEditing={props.isEditing}
    />
  ))

  return (
    <div className="root nested" data-parentModelId={-1}>
      {items}
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    isEditing: (state.admin.resources[state.admin.resource.name.plural].mode === 'EDIT_INDEX')
  }
}

export default connect(mapStateToProps, null)(ListItems)