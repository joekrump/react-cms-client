import React from 'react';
import { capitalize } from '../../../../../helpers/StringHelper'
import { singularizeName } from '../../../../../helpers/ResourceHelper'
import ResourceForm from '../../../../Forms/ResourceForm';
import AdminLayout from '../../Layout/Layout'
import AppConfig from '../../../../../../app_config/app';
import PageTemplate from '../../../Templates/PageTemplate';

import { Link } from 'react-router'
import FlatButton from 'material-ui/FlatButton';
import BackArrow from 'material-ui/svg-icons/navigation/arrow-back'
import {fullWhite, cyan300, cyan500, lightBlack } from 'material-ui/styles/colors';
import FloatingBackButton from '../../../../Nav/FloatingBackButton'

const New = ({ params: { resourceNamePlural }, location: { query } }) => {

  const nameSingular = singularizeName(resourceNamePlural);

  if(AppConfig.resourcesWithEditor.indexOf(nameSingular) !== -1) {
    return (
      <AdminLayout>
        <FloatingBackButton label={resourceNamePlural} link={'/admin/' + resourceNamePlural.toLowerCase()} />
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