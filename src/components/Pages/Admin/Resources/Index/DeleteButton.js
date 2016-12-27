import React from 'react'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import IconButton from 'material-ui/IconButton';
import APIClient from '../../../../../http/requests'
import { connect } from 'react-redux';

class DeleteButton extends React.Component {

  componentDidMount() {
    let client = new APIClient(this.props.dispatch);
    this.setState({client});
  }

  requestServerDelete(showItemCallback){
    
    this.state.client.del(this.props.resourceType + '/' + this.props.modelId)
    .then((res) => {
      if(res.statusCode !== 200) {
        this.displaySnackbarError();
        showItemCallback(true); // Set visibility to true
      } else {
        this.state.client.updateToken(res.header.authorization);
      }
    })
    .catch((res) => {
      if(res.statusCode === 404) {
        let errorText = `Error: Could not delete. No ${this.props.resourceType} with ID=${this.props.modelId} found.`;
        this.displaySnackbarError(errorText);
      } else {
        this.displaySnackbarError();
        showItemCallback(true); // Set visibility to true
      }
    })
  }

  displaySnackbarError(errorText) {
    errorText = errorText === undefined ? `Error: Could not delete the ${this.props.resourceType}. Something unexpected happened.` : errorText;
    this.props.updateSnackbar(true, 'Error', errorText, 'error');
  }

  handleDelete(e){
    e.preventDefault();

    this.props.showItemCallback(false); // Hide The IndexItem
    this.props.deleteItemClicked(this.props.modelId);
    this.requestServerDelete(this.props.showItemCallback);
  }

  render() {
    return (
      <IconButton style={this.props.styles.buttonStyles} tooltip="Delete" tooltipPosition='top-center' onClick={(event) => this.handleDelete(event)}>
        <DeleteIcon style={this.props.styles.smallIcon} />
      </IconButton>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteItemClicked: (item_id) => {
      dispatch ({
        type: 'U_INDEX_ITEM_DELETED',
        item_id
      })
    },
    updateSnackbar: (show, header, content, notificationType) => {
      dispatch ({
        type: 'NOTIFICATION_SNACKBAR_UPDATE',
        show,
        header,
        content,
        notificationType
      })
    },
    dispatch  
  }
}

export default connect(null, mapDispatchToProps)(DeleteButton);
