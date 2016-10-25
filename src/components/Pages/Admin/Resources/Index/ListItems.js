import React from 'react';
import IndexItem from './IndexItem';

const ListItems = (props) => {
  let items = props.childIds.map((childId) => (
    <IndexItem 
      key={`${props.resourceType}-${childId}`}
      modelId={childId}
      resourceType={props.resourceType}
      editMode={props.editMode}
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
    lookupArray: state.tree.indexTree.lookupArray,
  }
}

export default ListItems