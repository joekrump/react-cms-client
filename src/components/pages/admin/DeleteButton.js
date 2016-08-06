import React from 'react'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import IconButton from 'material-ui/IconButton';

const styles = {
  smallIcon: {
    width: 24,
    height: 24,
  },
  buttonStyles: {
    paddingLeft: 4,
    paddingRight: 4,
  }
}

const DeleteButton = (props) => {

  return (
    <IconButton style={styles.buttonStyles} tooltip="Delete" tooltipPosition='top-center'>
      <DeleteIcon styles={styles.smallIcon}/>
    </IconButton>
  )
}


export default DeleteButton;
