import { getEditorContent } from '../ResourcePageHelper'

const Edit = ({ params: { resourceNamePlural, resourceId }, location: { query } }) => (
  getEditorContent('edit', resourceNamePlural, resourceId)
);

export default Edit;