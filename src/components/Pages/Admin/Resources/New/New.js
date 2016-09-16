import {getEditorContent} from '../ResourcePageHelper'

const New = ({ params: { resourceNamePlural }, location: { query } }) => (
  getEditorContent('new', resourceNamePlural)
);
export default New;