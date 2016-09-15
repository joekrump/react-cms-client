import React from 'react'
import EditButton from './EditButton';
import DeleteButton from './DeleteButton';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './IndexItemActions.scss'


const IndexItemActions = (props) => {
  return (
    <div className="action-button-container">
      {props.extraButtons ? props.extraButtons : null}
      <EditButton resourceType={props.resourceType} id={props.id} queryProps={{...props.queryProps}}/>
      <DeleteButton resourceType={props.resourceType} id={props.id} showItemCallback={props.deleteCallback}/>
    </div>
  );
}

export default withStyles(s)(IndexItemActions);