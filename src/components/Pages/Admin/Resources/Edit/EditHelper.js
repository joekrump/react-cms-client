import React from 'react';
import ResourceForm from '../../../../Forms/ResourceForm';
import AppConfig from '../../../../../../app_config/app';
import PageTemplate from '../../../Templates/PageTemplate';

import { capitalize } from '../../../../../helpers/StringHelper'
import { singularizeName } from '../../../../../helpers/ResourceHelper'

export function getEditorContent(resourceNamePlural, resourceId){
  const nameSingular = singularizeName(resourceNamePlural);

  if(AppConfig.resourcesWithEditor.indexOf(nameSingular) !== -1){
    
    return (
      <PageTemplate 
        submitUrl={resourceNamePlural + '/' + resourceId}
        resourceId={resourceId}
        resourceType={nameSingular}
        resourceNamePlural={resourceNamePlural}
        context='edit'
      />
    )
  } else {
    
    return (
      <div>
        <h1>
          Edit {capitalize(nameSingular)} {resourceId}
        </h1>
        <ResourceForm 
          formName={nameSingular + 'Form'} 
          submitUrl={resourceNamePlural + '/' + resourceId}
          resourceId={resourceId}
          resourceType={nameSingular}
          resourceNamePlural={resourceNamePlural}
          context='edit'
        />
      </div>
    )
  }
}