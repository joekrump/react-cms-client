import React from 'react';
import ResourceForm from '../../../Forms/ResourceForm';
import AppConfig from '../../../../../app_config/app';
import { capitalize } from '../../../../helpers/StringHelper'
import AdminLayout from '../Layout/AdminLayout'
import PageEdit from '../../Page/Edit';
import CardEdit from '../../Card/Edit';
import EditPageLayout from '../Layout/EditPageLayout'

function getEditComponent(editContext, nameSingular, namePlural, resourceId) {
  if(nameSingular === 'page') {
    return (
      <EditPageLayout>
        <div className="admin-edit">
          <PageEdit 
            submitUrl={editContext === 'new' ? namePlural : (namePlural + '/' + resourceId)}
            resourceType={nameSingular}
            resourceId={resourceId}
            resourceNamePlural={namePlural}
            editContext={editContext}
          />
        </div>
      </EditPageLayout>
    )
  } else if (nameSingular === 'card') {
    return (
      <AdminLayout>
        <div className="admin-edit">
          <CardEdit 
            submitUrl={editContext === 'new' ? namePlural : (namePlural + '/' + resourceId)}
            resourceType={nameSingular}
            resourceId={resourceId}
            resourceNamePlural={namePlural}
            editContext={editContext}
          />
        </div>
      </AdminLayout>
    )
  } else {
    console.warn('COULD NOT DETERMINE EDIT COMPONENT')
    return null;
  }
}

export function getEditorContent(editContext, nameSingular, namePlural, resourceId){

  if(AppConfig.resourcesWithEditor.indexOf(nameSingular) !== -1){
    return (getEditComponent(editContext, nameSingular, namePlural, resourceId))
  } else {
    return (
      <AdminLayout>
        <div className="admin-edit">
          <h1>{editContext === 'new' ? 'New' : 'Edit'} {capitalize(nameSingular)}</h1>

          <ResourceForm 
            formName={nameSingular + 'Form'} 
            resourceURL={editContext === 'new' ? namePlural : (namePlural + '/' + resourceId)}
            resourceId={resourceId}
            resourceType={nameSingular}
            editContext={editContext}
          />
        </div>
      </AdminLayout>
    )
  }
}