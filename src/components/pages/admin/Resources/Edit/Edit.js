import React from 'react';
import { capitalize } from '../../../helpers/string'
import ResourceForm from '../../Forms/ResourceForm';
import AddResourceButton from './AddButton';
import { singularizeName } from '../../../helpers/ResourceHelper'

const Edit = ({ params: { resourceNamePlural, resourceId }, location: { query } }) => {
  const nameSingular = singularizeName(resourceNamePlural);
  
  return (

    <div className="admin-edit">
      <h1>Edit {capitalize(nameSingular)} {resourceId}</h1>

      <ResourceForm 
        formName={nameSingular + 'Form'} 
        submitUrl={resourceNamePlural + '/' + resourceId}
        resourceId={resourceId}
        resourceType={nameSingular}
        resourceNamePlural={resourceNamePlural}
        context='edit'
      />
      <AddResourceButton resourceNameSingular={nameSingular}/>
    </div>
  );
};
export default Edit;