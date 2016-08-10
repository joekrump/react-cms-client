import React from 'react';
import { capitalize } from '../../../helpers/string'
import ResourceForm from './ResourceForm';
import AddResourceButton from './AddButton';
// import { pluralizeName } from '../../../helpers/ResourceHelper'

const Edit = ({ params: { resourceNameSingular, resourceId }, location: { query } }) => {
  return (

    <div className="admin-edit">
      <h1>Edit {capitalize(resourceNameSingular)} {resourceId}</h1>

      <ResourceForm 
        formName={resourceNameSingular + 'Form'} 
        submitUrl={resourceNameSingular + '/' + resourceId + '/update'}
        resourceId={resourceId}
        resourceType={resourceNameSingular}
        context='edit'
      />
      <AddResourceButton resourceNameSingular={resourceNameSingular}/>
    </div>
  );
};
export default Edit;