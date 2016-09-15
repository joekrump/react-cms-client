import React from 'react';
import AdminLayout from '../../Layout/Layout'
import FloatingBackButton from '../../../../Nav/FloatingBackButton'

import {getEditorContent} from '../ResourcePageHelper'

const Edit = ({ params: { resourceNamePlural, resourceId }, location: { query } }) => (
  getEditorContent('edit', resourceNamePlural, resourceId, {...query})
);

export default Edit;