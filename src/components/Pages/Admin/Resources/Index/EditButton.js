import React from 'react'
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'
import IconButton from 'material-ui/IconButton';
import { Link } from 'react-router'

const EditButton = (props) => (
  <IconButton style={props.styles.buttonStyles} tooltip="Edit" 
    tooltipPosition='top-center' 
    containerElement={
      <Link to={{
        pathname: '/admin/' + props.resourceType + '/' + props.modelId + '/edit',
        query: {...props.queryProps}
      }} />
    }
  >
    <EditIcon style={props.styles.smallIcon} />
  </IconButton>
)


export default EditButton;
