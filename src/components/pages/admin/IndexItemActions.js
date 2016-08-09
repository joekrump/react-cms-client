import React from 'react'
import EditButton from './EditButton';
import DeleteButton from './DeleteButton';


import './IndexItemActions.css'


const IndexItemActions = (props) => {
  return (
    <div className="action-button-container">
      {props.extraButtons ? props.extraButtons : null}
      <EditButton resourceType={props.resourceType} id={props.id} />
      <DeleteButton resourceType={props.resourceType} id={props.id} hideItemCallback={props.deleteCallback}/>
    </div>
  );
}

export default IndexItemActions;