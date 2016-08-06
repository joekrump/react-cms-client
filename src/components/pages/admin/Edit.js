import React from 'react';
import { capitalize } from '../../../helpers/string'
import ResourceForm from './ResourceForm';

const Edit = ({ params: { resourceName, resourceId }, location: { query } }) => {
  return (

    <div className="admin-edit">
      <h1>Edit</h1>

      {/* TODO: EDIT FORM GOES HERE must receive formName, submitUrl, resourceType (in order to get form fields), context: (edit, or create) */}
      <ResourceForm 
        formName={resourceName + 'Form'} 
        submitUrl={'users/' + resourceId + '/update'}
        resourceType={resourceName}
        context='edit'
      />
    </div>
  );
};
export default Edit;