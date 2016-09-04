import React from 'react';
import ResourceForm from '../../../Forms/ResourceForm';
import AppConfig from '../../../../../app_config/app';
import PageTemplate from '../../Templates/PageTemplate';

import { capitalize } from '../../../../helpers/StringHelper'
import { singularizeName } from '../../../../helpers/ResourceHelper'

export function getEditorContent(context, resourceNamePlural, resourceId){
  const nameSingular = singularizeName(resourceNamePlural);

  if(AppConfig.resourcesWithEditor.indexOf(nameSingular) !== -1){
    
    return (
      <PageTemplate 
        submitUrl={context === 'new' ? resourceNamePlural : (resourceNamePlural + '/' + resourceId)}
        resourceType={nameSingular}
        resourceId={resourceId}
        resourceNamePlural={resourceNamePlural}
        context={context}
      />
    )
  } else {
    
    return (
      <div>
        <h1>New {capitalize(nameSingular)}</h1>

        <ResourceForm 
          formName={nameSingular + 'Form'} 
          submitUrl={context === 'new' ? resourceNamePlural : (resourceNamePlural + '/' + resourceId)}
          resourceId={resourceId}
          resourceType={nameSingular}
          resourceNamePlural={resourceNamePlural}
          context={context}
        />
      </div>
    )
  }
}