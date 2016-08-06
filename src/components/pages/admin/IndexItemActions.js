import React from 'react'
import EditButton from './EditButton';
import DeleteButton from './DeleteButton';


import './IndexItemActions.css'

const IndexItemActions = (props) => {
  return (
    <div className="action-button-container">
      <EditButton />
      <DeleteButton />
    </div>
  );
}

export default IndexItemActions;