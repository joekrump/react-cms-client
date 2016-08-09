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

  let handleDelete = (e) => {
    e.preventDefault();

    requestServerDelete();
    // TODO: Make DELETE request using superagent using post. Resource id should be accessible through props.id
  }

  let requestServerDelete = () => {
    request.del(AppConfig.apiBaseUrl + props.resourceType + '/' + props.id)
      .set('Authorization', 'Bearer ' + sessionStorage.laravelAccessToken)
      .end(function(err, res) {
        if(err){
          console.log("error", err);
        } else if(res.statusCode !== 200) {
          console.log('errorCode', res);
        } else {
          console.log('Removed')
        }
      }.bind(this))
  }
  return (
    <IconButton style={styles.buttonStyles} tooltip="Delete" tooltipPosition='top-center' onClick={handleDelete}>
      <DeleteIcon style={styles.smallIcon} />
    </IconButton>
  )
}


export default DeleteButton;
