import React from 'react';
import { capitalize } from '../../../helpers/string'
import ResourceForm from './ResourceForm';
import AddResourceButton from './AddButton';

const New = ({ params: { resourceNameSingular }, location: { query } }) => {
  return (
    <div className="admin-edit">
      <h1>New {capitalize(resourceNameSingular)}</h1>

      <ResourceForm 
        formName={resourceNameSingular + 'Form'} 
        submitUrl={resourceNameSingular +'/create'}
        resourceType={resourceNameSingular}
        context='new'
      />
      <AddResourceButton resourceNameSingular={resourceNameSingular}/>
    </div>
  );
};
export default New;