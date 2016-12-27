import React from 'react'
import EditButton from './EditButton';
import DeleteButton from './DeleteButton';
import PreviewButton from './PreviewButton'

const buttonStyles = {
  smallIcon: {
    width: 24,
    height: 24,
  },
  buttonStyles: {
    width: 36,
    height: 36,
    padding: 6
  }
}

const IndexItemActions = (props) => {
  return (
    <div className="action-button-container">
      {props.extraButtons ? props.extraButtons : null}
      <EditButton resourceType={props.resourceType} modelId={props.modelId} queryProps={{...props.queryProps}} styles={buttonStyles} />
      {props.previewPath ? <PreviewButton path={props.previewPath} styles={buttonStyles} /> : null}
      {props.deletable ? 
        <DeleteButton resourceType={props.resourceType} modelId={props.modelId} showItemCallback={props.deleteCallback} styles={buttonStyles} />
        : null }
    </div>
  );
}

export default IndexItemActions;