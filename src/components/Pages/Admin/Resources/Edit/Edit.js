import { getEditorContent } from '../ResourcePageHelper'
import { connect } from 'react-redux';

const Edit = (props) => (
  getEditorContent('edit', props.resourceNameSingular, props.resourceNamePlural, props.params.resourceId)
);

const mapStateToProps = (state) => {
  return {
    resourceNamePlural: state.admin.resource.name.plural,
    resourceNameSingular: state.admin.resource.name.singular
  }
}
export default connect(mapStateToProps)(Edit);