import React from 'react';
import { capitalize } from '../../../../../helpers/StringHelper'
import { singularizeName } from '../../../../../helpers/ResourceHelper'
import ResourceForm from '../../../../Forms/ResourceForm';
import AdminLayout from '../../Layout/Layout'

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
      </div>
    </AdminLayout>
  );
};
export default New;