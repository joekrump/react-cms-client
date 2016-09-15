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

export function getEditorContent(context, resourceNamePlural, resourceId, queryProps){
  const nameSingular = singularizeName(resourceNamePlural);

  if(AppConfig.resourcesWithEditor.indexOf(nameSingular) !== -1){
    return (
      <EditPageLayout>
        <div className="admin-edit">
          <PageEdit 
            submitUrl={context === 'new' ? resourceNamePlural : (resourceNamePlural + '/' + resourceId)}
            resourceType={nameSingular}
            resourceId={resourceId}
            resourceNamePlural={resourceNamePlural}
            context={context}
            template_id={queryProps ? queryProps.template_id : 1}
          />
        </div>
      </EditPageLayout>
    )
  } else {
    return (
      <AdminLayout>
        <div className="admin-edit">
          <BackButton label={resourceNamePlural} link={'/admin/' + resourceNamePlural.toLowerCase()} />
          <h1>{context === 'new' ? 'New' : 'Edit'} {capitalize(nameSingular)}</h1>

          <ResourceForm 
            formName={nameSingular + 'Form'} 
            submitUrl={context === 'new' ? resourceNamePlural : (resourceNamePlural + '/' + resourceId)}
            resourceId={resourceId}
            resourceType={nameSingular}
            resourceNamePlural={resourceNamePlural}
            context={context}
          />
        </div>
      </AdminLayout>
    )
  }
}