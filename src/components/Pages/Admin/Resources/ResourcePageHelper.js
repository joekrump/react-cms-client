import React from 'react';
import ResourceForm from '../../../Forms/ResourceForm';
import AppConfig from '../../../../../app_config/app';
import { capitalize } from '../../../../helpers/StringHelper'
import { singularizeName } from '../../../../helpers/ResourceHelper'
import AdminLayout from '../Layout/AdminLayout'
import PageEdit from '../../Page/Edit';
import CardEdit from '../../Card/Edit';
import EditPageLayout from '../Layout/EditPageLayout'
import EditCardLayout from '../Layout/EditCardLayout'
import BackButton from '../../../Nav/BackButton'
import FloatingPageMenu from '../../../Menu/FloatingPageMenu';

function getEditComponent(nameSingular, editContext, resourceNamePlural, resourceId) {
  const name = nameSingular.toLowerCase();
  if(name === 'page') {
    return (
      <EditPageLayout>
        <div className="admin-edit">
          <PageEdit 
            submitUrl={editContext === 'new' ? resourceNamePlural : (resourceNamePlural + '/' + resourceId)}
            resourceType={nameSingular}
            resourceId={resourceId}
            resourceNamePlural={resourceNamePlural}
            editContext={editContext}
          />
        </div>
      </EditPageLayout>
    )
  } else if (name === 'card') {
    return (
      <EditCardLayout>
        <div className="admin-edit">
          <CardEdit 
            submitUrl={editContext === 'new' ? resourceNamePlural : (resourceNamePlural + '/' + resourceId)}
            resourceType={nameSingular}
            resourceId={resourceId}
            resourceNamePlural={resourceNamePlural}
            editContext={editContext}
          />
        </div>
      </EditCardLayout>
    )
  } else {
    console.warn('COULD NOT DETERMINE EDIT COMPONENT')
    return null;
  }
}

export function getEditorContent(editContext, resourceNamePlural, resourceId){
  const nameSingular = singularizeName(resourceNamePlural);

  if(AppConfig.resourcesWithEditor.indexOf(nameSingular) !== -1){
    return (getEditComponent(nameSingular, editContext, resourceNamePlural, resourceId))
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
            editContext={editContext}
          />
        </div>
      </AdminLayout>
    )
  }
}