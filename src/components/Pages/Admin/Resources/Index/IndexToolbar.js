import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import { connect } from 'react-redux';
import APIClient from '../../../../../http/requests';

let buttonStyles = {
  margin: '10px 16px'
};

class IndexToolbar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: 3,
      buttonDisabled: false
    };
  }

  makeEditButton(mode, hasChanges, disable) {
    let button = null;

    if(mode === 'EDIT_INDEX' && hasChanges) {
      button = <RaisedButton label="Save Changes" primary={true} 
                             style={buttonStyles}
                             disabled={disable} 
                             onTouchTap={(event) => this.saveChanges(event) }/>
    } else if (mode === 'EDIT_INDEX') {
      button = <RaisedButton label="Cancel" primary={true} 
                             style={buttonStyles}
                             disabled={disable} 
                             onTouchTap={(event) => this.cancelEdit(event) }/>
    } else {
      button = <RaisedButton label="Edit" primary={true} 
                             style={buttonStyles}
                             disabled={disable} 
                             onTouchTap={(event) => this.enableEdit(event) }/>
    }
    return button;
  }

  saveChanges(event) {

    if(this.state.buttonDisabled) {
      return;
    }
    this.setState({buttonDisabled: true})
    setTimeout(() => {
      this.setState({buttonDisabled: false})
    }, 500)

    // save and then update state to show that no more changes to save.
    //
    let client = new APIClient(this.context.store);

    client.put(this.props.resourceNamePlural + '/update-index', true, {
      data: {
        nodeArray: this.props.indexNodeArray
      }})
      .then((res) => {
        if (res.statusCode !== 200) {
          this.props.updateSnackbar(true, 'Error', res.data, 'error');
        } else {
          this.props.updateSnackbar(true, 'Success', 'Update Successful', 'success');
        }
        this.props.updateIndexHasChanges(false);
      })
      .catch((err) => {
        // Something unexpected happened
        this.props.updateSnackbar(true, 'Error', err, 'error');
      })
  }

  cancelEdit(event) {
    
    if(this.state.buttonDisabled) {
      return;
    }
    this.setState({buttonDisabled: true})
    setTimeout(() => {
      this.setState({buttonDisabled: false})
    }, 500)
    this.props.updateMode('PASSIVE');
  }

  enableEdit(event) {

    if(this.state.buttonDisabled) {
      return;
    }
    this.setState({buttonDisabled: true})
    setTimeout(() => {
      this.setState({buttonDisabled: false})
    }, 500)
    this.props.updateMode('EDIT_INDEX');
  }

  render() {
    return (
      <Toolbar style={{backgroundColor: this.context.muiTheme.palette.canvasColor, padding: 0}}>
        <ToolbarGroup>
          {this.makeEditButton(this.props.adminMode, this.props.hasChanges, this.state.buttonDisabled)}
        </ToolbarGroup>
      </Toolbar>
    );
  }
}

IndexToolbar.contextTypes = {
  muiTheme: React.PropTypes.object.isRequired,
  store: React.PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => {
  return {
    resourceNamePlural: state.admin.resource.name.plural,
    hasChanges: state.admin.index.hasChanges,
    indexNodeArray: state.tree.indexTree.nodeArray,
    adminMode: state.admin.mode
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateMode: (mode) => {
      dispatch ({
        type: 'UPDATE_MODE',
        mode
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
    updateIndexHasChanges: (hasChanges) => {
      dispatch ({
        type: 'UPDATE_INDEX_HAS_CHANGES',
        hasChanges
      })
    }
  };
}



export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IndexToolbar)
