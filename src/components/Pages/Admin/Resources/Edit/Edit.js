import React from 'react';
import {getEditorContent} from '../ResourcePageHelper'

const Edit = ({ params: { resourceNamePlural, resourceId }, location: { query } }) => (
  getEditorContent('edit', resourceNamePlural, resourceId, {...query})
);

export default Edit;