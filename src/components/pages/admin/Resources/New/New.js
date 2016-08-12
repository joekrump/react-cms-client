import React from 'react';
import { capitalize } from '../../../helpers/string'
import ResourceForm from '../../Forms/ResourceForm';
import AddResourceButton from './AddButton';
import { singularizeName } from '../../../helpers/ResourceHelper'
import AdminLayout from '../../Layout/Laout'

const New = ({ params: { resourceNamePlural }, location: { query } }) => {

  const nameSingular = singularizeName(resourceNamePlural);

  return (
    <AdminLayout>
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
    </AdminLayout>
  );
};
export default New;