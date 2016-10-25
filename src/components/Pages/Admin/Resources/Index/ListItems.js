import React from 'react';
import IndexItem from './IndexItem';
import { connect } from 'react-redux';

const ListItems = (props) => {
  let items = props.childIndexes.map((childIndex, i) => {
    return( <IndexItem 
              key={`${props.resourceType}-${i}`}
              modelId={props.nodeArray[childIndex].node.item_id}
              primary={props.nodeArray[childIndex].node.primary}
              secondary={props.nodeArray[childIndex].node.secondary}
              resourceType={props.resourceType}
              deletable={props.nodeArray[childIndex].node.deletable}
              childIndexes={props.nodeArray[childIndex].childIndexes}
              depth={props.nodeArray[childIndex].depth}
              root={true}
              unmovable={props.nodeArray[childIndex].node.unmovable}
              denyNested={props.nodeArray[childIndex].node.denyNested}
              editMode={props.editMode}
              extraData={{...props.nodeArray[childIndex].node}}
              previewPath={props.nodeArray[childIndex].node.previewPath}
            />)
  })

  return (<div className="root nested" data-parentModelId={-1}>
    {items}
  </div>)
}

const mapStateToProps = (state, ownProps) => {
  return {
    nodeArray: state.tree.indexTree.nodeArray
  }
}

export default connect(
  mapStateToProps,
  null
)(ListItems)