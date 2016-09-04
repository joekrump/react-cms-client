import React from 'react';
import AdminLayout from '../../Layout/Layout'
import FloatingBackButton from '../../../../Nav/FloatingBackButton'

import {getEditorContent} from './EditHelper'

const Edit = ({ params: { resourceNamePlural, resourceId }, location: { query } }) => {
  return (
    <AdminLayout>
      <div className="admin-edit">
        <FloatingBackButton label={resourceNamePlural} link={'/admin/' + resourceNamePlural.toLowerCase()} />
        {getEditorContent(resourceNamePlural, resourceId)}
      </div>
    </AdminLayout>
  )
};
export default Edit;