import React from 'react'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import IconButton from 'material-ui/IconButton';
import APIClient from '../../../../../http/requests'

const styles = {
  smallIcon: {
    width: 24,
    height: 24,
  },
  buttonStyles: {
    paddingRight: 4,
  }
}

class DeleteButton extends React.Component {

  componentDidMount() {
    let client = new APIClient(this.context.store);
    this.setState({
      client
    })
  }

  requestServerDelete(showItemCallback){
    
    this.state.client.del(this.props.resourceType + '/' + this.props.id)
    .then((res) => {
      if(res.statusCode !== 200) {
        console.log('errorCode', res);
        showItemCallback(true); // Set visibility to true
      } else {
        this.state.client.updateToken(res.header.authorization);
        // TODO: remove item from store.
      }
    })
    .catch((res) => {
      if(res.statusCode === 404) {
        console.warn('Error: Could not delete. No ' + this.props.resourceType + ' with ID=' + this.props.id + ' found.');
        // TODO: put message in SnackBar notification
      } else {
        showItemCallback(true); // Set visibility to true
      }
    })
  }

  handleDelete(e){
    e.preventDefault();

    this.props.showItemCallback(false); // Hide The IndexItem
    
    this.requestServerDelete(this.props.showItemCallback);
  }

  render() {
    return (
      <IconButton style={styles.buttonStyles} tooltip="Delete" tooltipPosition='top-center' onClick={(event) => this.handleDelete(event)}>
        <DeleteIcon style={styles.smallIcon} />
      </IconButton>
    )
  }
}

DeleteButton.contextTypes = {
  store: React.PropTypes.object.isRequired
}

export default DeleteButton;
