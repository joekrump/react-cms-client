import React from 'react';
import AdminLayout from '../../Layout/Layout'
import FloatingBackButton from '../../../../Nav/FloatingBackButton'

import {getEditorContent} from '../ResourcePageHelper'

const Edit = ({ params: { resourceNamePlural, resourceId }, location: { query } }) => (
  <AdminLayout>
    <div className="admin-edit">
      <FloatingBackButton label={resourceNamePlural} link={'/admin/' + resourceNamePlural.toLowerCase()} />
      {getEditorContent('edit', resourceNamePlural, resourceId, {...query})}
    </div>
  </AdminLayout>
);

export default Edit;