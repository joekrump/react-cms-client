import React from 'react';
import { List } from 'material-ui/List';
import CircularProgress from 'material-ui/CircularProgress';
import AdminLayout from '../../Layout/AdminLayout'
import { capitalize } from '../../../../../helpers/StringHelper'
import APIClient from '../../../../../http/requests';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './index.scss';
import dragula from 'react-dragula';
import ListItems from './ListItems';
import TreeHelper from '../../../../../helpers/TreeHelper';
import { connect } from 'react-redux';
import NotificationSnackbar from '../../../../Notifications/Snackbar/Snackbar'
import IndexToolbar from './IndexToolbar';

class Index extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = {
      loading: true,
      dragulaDrake: null,
      TreeHelper: {}
    }
  }

  handleDrop(el, target, source, sibling){
    try {
      let siblingId = sibling ? parseInt(sibling.id, 10) : null;

      if(source.dataset.parentmodelid) {
        // (document).removeChild(el);
        this.state.TreeHelper.updateTree(parseInt(el.id, 10), siblingId, parseInt(target.dataset.parentmodelid, 10))
      }
      console.log('update');
      this.props.updateTree(this.state.TreeHelper.richNodeArray);
      this.props.updateIndexHasChanges(true)
    } catch (e) {
      console.warn('ERROR: ', e)
    } 
  }

  setItems(resourceNamePlural){
    this.setState({loading: true})
    let client = new APIClient(this.context.store);

    client.get(resourceNamePlural).then((res) => {
      this.setState({loading: false})

      if(res.statusCode !== 200) {
        this.props.updateTree([]) // Reset Items
        console.log('Bad Response: ', res)

      } else {
        // Set items so that new elements are in the DOM before dragula is initialized.
        let treeHelper = new TreeHelper(res.body.data)
        this.setState({
          TreeHelper: treeHelper
        }) 

        this.props.updateTree(treeHelper.richNodeArray);

        client.updateToken(res.header.authorization)

        if(typeof document !== 'undefined'){
          let drake = dragula({
            containers: [].slice.apply(document.querySelectorAll('.nested')),
            moves: (el, source, handle, sibling) => {
              return handle.classList.contains('drag-handle')
            },
            accepts: (el, target, source, sibling) => {
              // prevent dragged containers from trying to drop inside itself
              return !this.state.TreeHelper.contains(el, target);
            }
          });
          drake.on('drop', (el, target, source, sibling) => this.handleDrop(el, target, source, sibling));

          this.setState({
            dragulaDrake: drake
          });
        }
      }
    }).catch((res) => {
      this.setState({loading: false})
      console.warn('Error: ', res)
      this.props.updateTree([]) // Reset Items
    })
  }

  componentWillMount() {
    let resourceNamePlural = this.props.params.resourceNamePlural.toLowerCase();
    this.props.updateResourceName(resourceNamePlural);
    this.setItems(resourceNamePlural);
  }
  componentWillUnmount() {
    this.state.dragulaDrake.destroy();
    this.setState({
      dragulaDrake: null
    })
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.params.resourceNamePlural !== this.props.params.resourceNamePlural) {
      this.props.updateResourceName(nextProps.params.resourceNamePlural);
      this.setItems(nextProps.params.resourceNamePlural);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.params.resourceNamePlural !== this.props.params.resourceNamePlural) {
      return true;
    } else if (nextProps.nodeArray.length !== this.props.nodeArray.length) {
      return true;
    } else if (nextState.loading !== this.state.loading) {
      return true;
    } else if (nextProps.adminMode !== this.props.adminMode) {
      return true;
    } else if (nextProps.hasChanges !== this.props.hasChanges) {
      return true;
    } else {
      // console.log('nextProps ', nextProps)
      // console.log('nextState ', nextState)
      // console.log('props ', this.props)
      // console.log('state ', this.state)
      return false;
    }
  }

  getRootChildren() {
    console.log(this.props.nodeArray[0].node.children)
    return this.props.nodeArray.length > 0 ? this.props.nodeArray[0].node.children : [];
  }
  render() {
    let content = (<div className="empty"><h3>No {this.props.resourceNamePlural} yet</h3></div>);

    if(!this.state.loading && this.props.nodeArray.length > 0){
      content = (
        <ListItems items={this.getRootChildren()} 
                   resourceType={this.props.resourceNamePlural} 
                   editMode={this.props.adminMode === 'EDIT_INDEX'} 
                   />)
    }
    return (
      <AdminLayout>
        <div className={"admin-index" + (this.props.adminMode === 'EDIT_INDEX' ? ' index-edit' : '')}>
          <h1>{capitalize(this.props.resourceNamePlural)}</h1>
          <IndexToolbar />
          {this.state.loading ? (<CircularProgress />) : null}
          <List className="item-list">
            {this.state.loading || !(this.props.nodeArray.length > 0) ? null : <span className="spacer"></span>}
            {content}
          </List>
        { this.props.children }
        </div>
        <NotificationSnackbar 
          open={this.props.snackbar.show} 
          header={this.props.snackbar.header}
          content={this.props.snackbar.content}
          type={this.props.snackbar.notificationType}
        />
      </AdminLayout>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    nodeArray: state.tree.indexTree.nodeArray,
    resourceNamePlural: state.admin.resource.name.plural,
    hasChanges: state.admin.index.hasChanges,
    adminMode: state.admin.mode,
    snackbar: {
      show: state.notifications.snackbar.show,
      header: state.notifications.snackbar.header,
      content: state.notifications.snackbar.content,
      notificationType: state.notifications.snackbar.notificationType
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateTree: (nodeArray) => {
      dispatch ({
        type: 'UPDATE_TREE',
        nodeArray
      })
    },
    updateResourceName: (namePlural) => {
      dispatch({
        type: 'UPDATE_CURRENT_RESOURCE_NAME',
        namePlural
      })
    },
    updateIndexHasChanges: (hasChanges) => {
      dispatch({
        type: 'UPDATE_INDEX_HAS_CHANGES',
        hasChanges
      })
    }
  };
}

Index.contextTypes = {
  store: React.PropTypes.object.isRequired
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(s)(Index))
