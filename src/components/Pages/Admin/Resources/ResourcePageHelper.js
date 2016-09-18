import React from 'react';
import ResourceForm from '../../../Forms/ResourceForm';
import AppConfig from '../../../../../app_config/app';
import { capitalize } from '../../../../helpers/StringHelper'
import { singularizeName } from '../../../../helpers/ResourceHelper'
import AdminLayout from '../Layout/AdminLayout'
import PageEdit from '../../Templates/PageEdit';
import EditPageLayout from '../Layout/EditPageLayout'
import BackButton from '../../../Nav/BackButton'
import FloatingPageMenu from '../../../Menu/FloatingPageMenu';

export function getEditorContent(editContext, resourceNamePlural, resourceId, queryProps){
  const nameSingular = singularizeName(resourceNamePlural);

  if(AppConfig.resourcesWithEditor.indexOf(nameSingular) !== -1){
    let template_id;

    return (
      <EditPageLayout>
        <div className="admin-edit">
          <PageEdit 
            submitUrl={editContext === 'new' ? resourceNamePlural : (resourceNamePlural + '/' + resourceId)}
            resourceType={nameSingular}
            resourceId={resourceId}
            resourceNamePlural={resourceNamePlural}
            editContext={editContext}
            template_id={queryProps && queryProps.template_id ? parseInt(queryProps.template_id, 10) : 1}
          />
        </div>
      </EditPageLayout>
    )
  } else {
    return (
      <AdminLayout>
        <div className="admin-edit">
          <FloatingPageMenu>
            <BackButton label={resourceNamePlural} link={'/admin/' + resourceNamePlural.toLowerCase()} />
          </FloatingPageMenu>
          <h1>{editContext === 'new' ? 'New' : 'Edit'} {capitalize(nameSingular)}</h1>

          <ResourceForm 
            formName={nameSingular + 'Form'} 
            submitUrl={editContext === 'new' ? resourceNamePlural : (resourceNamePlural + '/' + resourceId)}
            resourceId={resourceId}
            resourceType={nameSingular}
            resourceNamePlural={resourceNamePlural}
            context={editContext}
          />
        </div>
      </AdminLayout>
    )
  }
}