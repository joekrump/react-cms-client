import { getEditorContent } from '../ResourcePageHelper'
import { connect } from 'react-redux';

const New = (props) => (
  getEditorContent('new', props.resourceNameSingular, props.resourceNamePlural, props.params.resourceId)
);

const mapStateToProps = (state) => {
  return {
    resourceNamePlural: state.admin.resource.name.plural,
    resourceNameSingular: state.admin.resource.name.singular
  }
}
export default connect(mapStateToProps)(New);