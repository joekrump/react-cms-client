import React from 'react'
import EditButton from './EditButton';
import DeleteButton from './DeleteButton';

const IndexItemActions = (props) => {
  return (
    <div className="action-button-container">
      {props.extraButtons ? props.extraButtons : null}
      <EditButton resourceType={props.resourceType} modelId={props.modelId} queryProps={{...props.queryProps}}/>
      {props.deletable ? 
        <DeleteButton resourceType={props.resourceType} modelId={props.modelId} showItemCallback={props.deleteCallback}/>
        : null }
    </div>
  );
}

export default IndexItemActions;