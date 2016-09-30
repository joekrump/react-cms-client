import React from 'react'
import EditButton from './EditButton';
import DeleteButton from './DeleteButton';
import PreviewButton from './PreviewButton'

const IndexItemActions = (props) => {
  return (
    <div className="action-button-container">
      {props.extraButtons ? props.extraButtons : null}
      {props.previewPath ? <PreviewButton path={props.previewPath} /> : null}
      <EditButton resourceType={props.resourceType} modelId={props.modelId} queryProps={{...props.queryProps}}/>
      {props.deletable ? 
        <DeleteButton resourceType={props.resourceType} modelId={props.modelId} showItemCallback={props.deleteCallback}/>
        : null }
    </div>
  );
}

export default IndexItemActions;