import React from 'react';
import { capitalize } from '../../../../../helpers/StringHelper'
import { singularizeName } from '../../../../../helpers/ResourceHelper'
import ResourceForm from '../../../../Forms/ResourceForm';
import AdminLayout from '../../Layout/Layout'
import AppConfig from '../../../../../../app_config/app';
import PageTemplate from '../../../Templates/PageTemplate';


const New = ({ params: { resourceNamePlural }, location: { query } }) => {

  const nameSingular = singularizeName(resourceNamePlural);

  if(AppConfig.resourcesWithEditor.indexOf(nameSingular) !== -1) {
    return (
      <AdminLayout>
        <PageTemplate 
          submitUrl={resourceNamePlural}
          resourceType={nameSingular}
          resourceNamePlural={resourceNamePlural}
          context='new'
        />
      </AdminLayout>
    );
  } else {
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
  }
};
export default New;