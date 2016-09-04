import React from 'react';
import AdminLayout from '../../Layout/Layout'
import FloatingBackButton from '../../../../Nav/FloatingBackButton'
import {getEditorContent} from '../ResourcePageHelper'

const New = ({ params: { resourceNamePlural }, location: { query } }) => (
  <AdminLayout>
    <div className="admin-edit">
      <FloatingBackButton label={resourceNamePlural} link={'/admin/' + resourceNamePlural.toLowerCase()} />
      {getEditorContent('new', resourceNamePlural)}
    </div>
  </AdminLayout>
);
export default New;