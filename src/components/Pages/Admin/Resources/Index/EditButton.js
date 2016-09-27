import React from 'react'

import EditIcon from 'material-ui/svg-icons/editor/mode-edit'
import IconButton from 'material-ui/IconButton';
import { Link } from 'react-router'

const styles = {
  smallIcon: {
    width: 24,
    height: 24
  },
  buttonStyles: {
    paddingRight: 4,
  }
}

const EditButton = (props) => {

  return (
    <IconButton style={styles.buttonStyles} tooltip="Edit" 
      tooltipPosition='top-center' 
      containerElement={
        <Link to={{
          pathname: '/admin/' + props.resourceType + '/' + props.modelId + '/edit',
          query: {...props.queryProps}
        }} />
      }
    >
      <EditIcon style={styles.smallIcon} />
    </IconButton>
  )
}


export default EditButton;
