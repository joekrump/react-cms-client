import React from 'react';
import { capitalize } from '../../../helpers/string'
import ResourceForm from './ResourceForm';
import AddResourceButton from './AddButton';
import { singularizeName } from '../../../helpers/ResourceHelper'

const New = ({ params: { resourceNamePlural }, location: { query } }) => {

  const nameSingular = singularizeName(resourceNamePlural);

  return (
    <div className="admin-edit">
      <h1>New {capitalize(nameSingular)}</h1>

      <ResourceForm 
        formName={nameSingular + 'Form'} 
        submitUrl={resourceNamePlural}
        resourceType={nameSingular}
        context='new'
      />
      <AddResourceButton resourceNameSingular={nameSingular}/>
    </div>
  );
};
export default New;