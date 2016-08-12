import React from 'react'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import IconButton from 'material-ui/IconButton';
import { apiDelete, updateToken } from '../../../http/requests'

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

  let requestServerDelete = (showItemCallback) => {
    apiDelete(props.resourceType + '/' + props.id)
      .end(function(err, res) {
        if(err){
          if(res.statusCode === 404) {
            console.warn('Error: Could not delete. No ' + props.resourceType + ' with ID=' + props.id + ' found.');
            // TODO: put message in SnackBar notification
          } else {
            showItemCallback(true); // Set visibility to true
          }
        } else if(res.statusCode !== 200) {
          console.log('errorCode', res);
          showItemCallback(true); // Set visibility to true
        } else {
          updateToken(res.header.authorization);
          // TODO: remove item from store.
        }
      })
  }

  let handleDelete = (e) => {
    e.preventDefault();

    props.showItemCallback(false); // Hide The IndexItem
    
    requestServerDelete(props.showItemCallback);
  }

  return (
    <IconButton style={styles.buttonStyles} tooltip="Delete" tooltipPosition='top-center' onClick={handleDelete}>
      <DeleteIcon style={styles.smallIcon} />
    </IconButton>
  )
}


export default DeleteButton;
