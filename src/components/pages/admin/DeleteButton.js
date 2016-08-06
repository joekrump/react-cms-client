import React from 'react'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import IconButton from 'material-ui/IconButton';

const styles = {
  smallIcon: {
    width: 24,
    height: 24,
  },
  buttonStyles: {
    paddingRight: 4,
  }
}

const DeleteButton = (props) => {

  let handleDelete = (e) => {
    e.preventDefault();
    console.log('TODO: Delete ' + props.id);
    // TODO: Make DELETE request using superagent using post. Resource id should be accessible through props.id
  }
  return (
    <IconButton style={styles.buttonStyles} tooltip="Delete" tooltipPosition='top-center' onClick={handleDelete}>
      <DeleteIcon styles={styles.smallIcon} />
    </IconButton>
  )
}


export default DeleteButton;
