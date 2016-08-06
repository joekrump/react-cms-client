import React from 'react'

import EditIcon from 'material-ui/svg-icons/editor/mode-edit'
import IconButton from 'material-ui/IconButton';


const styles = {
  smallIcon: {
    width: 24,
    height: 24
  },
  buttonStyles: {
    paddingLeft: 4,
    paddingRight: 4,
  }
}

const EditButton = (props) => {

  return (
    <IconButton style={styles.buttonStyles} tooltip="Edit" tooltipPosition='top-center'>
      <EditIcon style={styles.smallIcon} />
    </IconButton>
  )
}


export default EditButton;
