import React from 'react';
import { capitalize } from '../../../../../helpers/StringHelper'
import ResourceForm from '../../../../Forms/ResourceForm';
import { singularizeName } from '../../../../../helpers/ResourceHelper'
import AdminLayout from '../../Layout/Layout'
import AppConfig from '../../../../../../app_config/app';
import PageTemplate from '../../../Templates/PageTemplate';

const Edit = ({ params: { resourceNamePlural, resourceId }, location: { query } }) => {
  const nameSingular = singularizeName(resourceNamePlural);
  console.log(nameSingular)
  console.log(AppConfig.resourcesWithEditor.indexOf(nameSingular));
  if(AppConfig.resourcesWithEditor.indexOf(nameSingular) !== -1) {
    return (
      <AdminLayout>
        <PageTemplate 
          submitUrl={resourceNamePlural + '/' + resourceId}
          resourceId={resourceId}
          resourceType={nameSingular}
          resourceNamePlural={resourceNamePlural}
          context='edit'
        />
      </AdminLayout>
    );
  } else {
    return (
      <AdminLayout>
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
        </div>
      </AdminLayout>
    );
  }

};
export default Edit;