import React from 'react';
import IconButton from 'material-ui/IconButton';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import { connect } from 'react-redux';
import APIClient from '../../../../../http/requests';
import DoneIcon from 'material-ui/svg-icons/action/done';
import AddIcon from 'material-ui/svg-icons/content/add';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import {Link} from 'react-router';
import {greenA700} from 'material-ui/styles/colors'
import assign from 'lodash.assign';

const settingButtonStyles = {
  width: 36,
  height: 36,
  border: 20,
  marginTop: 10,
  marginBottom: 10,
  padding: 2
};

const rightButtonStyles = assign({}, settingButtonStyles, {marginRight: 7});

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
      button =  <IconButton tooltip="Save Changes"
                            tooltipPosition="top-center"
                            iconStyle={{color: greenA700}}
                            style={settingButtonStyles} 
                            disabled={disable} 
                            onTouchTap={(event) => this.saveChanges(event) }>
                  <DoneIcon />
                </IconButton>
    } else if (mode === 'EDIT_INDEX') {
      button =  <IconButton tooltip="Done"
                            tooltipPosition="top-center"
                            style={settingButtonStyles} 
                            disabled={disable} 
                            onTouchTap={(event) => this.cancelEdit(event) }>
                  <DoneIcon />
                </IconButton>
    } else {
      button =  <IconButton tooltip="Edit"
                            tooltipPosition="top-center"
                            style={settingButtonStyles} 
                            disabled={disable} 
                            onTouchTap={(event) => this.enableEdit(event) }>
                  <SettingsIcon />
                </IconButton>
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
    let client = new APIClient(this.props.dispatch);

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
      <Toolbar style={{
        backgroundColor: this.context.muiTheme.palette.canvasColor, 
        padding: 0,
        marginTop: 30
      }}>
        <ToolbarGroup>
          <h1 className="index-title">{this.props.resourceName}</h1>
        </ToolbarGroup>
        <ToolbarGroup>
          {this.makeEditButton(this.props.adminResourceMode, this.props.hasChanges, this.state.buttonDisabled)}
          <Link to={'/admin/' + this.props.resourceNamePlural + '/new'}>
            <IconButton tooltip="New"
                        tooltipPosition="top-center"
                        style={rightButtonStyles}>
              <AddIcon />
            </IconButton>
          </Link>
        </ToolbarGroup>
      </Toolbar>
    );
  }
}

IndexToolbar.contextTypes = {
  muiTheme: React.PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => {
  return {
    resourceNamePlural: state.admin.resource.name.plural,
    hasChanges: state.admin.index.hasChanges,
    indexNodeArray: state.tree.indexTree.nodeArray,
    adminResourceMode: state.admin.resources[state.admin.resource.name.plural].mode
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateMode: (mode) => {
      dispatch ({
        type: 'UPDATE_RESOURCE_MODE',
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
    },
    dispatch
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IndexToolbar)
