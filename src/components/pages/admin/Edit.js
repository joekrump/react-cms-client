import React from 'react';
import { capitalize } from '../../../helpers/string'

const Edit = ({ params: { resourceName, resourceId }, location: { query }} ) => {
  return (

    <div className="admin-edit">
      <h1>Edit {capitalize(resourceName)} {resourceId}</h1>


      <p>
        Here is where we are: { query }
      </p>

    </div>
  );
};
export default Edit;