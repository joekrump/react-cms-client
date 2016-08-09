import React from 'react'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import IconButton from 'material-ui/IconButton';
import request from 'superagent';
import AppConfig from '../../../../app_config/app'

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
    request.del(AppConfig.apiBaseUrl + props.resourceType + '/' + props.id)
      .set('Authorization', 'Bearer ' + sessionStorage.laravelAccessToken)
      .end(function(err, res) {
        if(err){
          console.log("error", err);
          showItemCallback(true); // Set visibility to true
        } else if(res.statusCode !== 200) {
          console.log('errorCode', res);
          showItemCallback(true); // Set visibility to true
        } else {
          console.log('Removed')
          // TODO: remove item from store.
        }
      }.bind(this))
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
