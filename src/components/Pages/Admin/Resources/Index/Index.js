import React from 'react';
import { List } from 'material-ui/List';
import CircularProgress from 'material-ui/CircularProgress';
import AdminLayout from '../../Layout/AdminLayout'
import { capitalize } from '../../../../../helpers/StringHelper'
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
    this.initializeDnD = this.initializeDnD.bind(this);
  }

  handleDrop(el, target, source, sibling){
    try {
      let siblingId = sibling ? parseInt(sibling.id, 10) : null;

      if(source.dataset.parentmodelid) {
        this.state.treeHelper.updateTree(parseInt(el.id, 10), siblingId, parseInt(target.dataset.parentmodelid, 10))
      }
      this.props.updateTree(this.state.treeHelper.richNodeArray);
      this.props.updateIndexHasChanges(true, this.props.resourceNamePlural)
    } catch (e) {
      console.warn('ERROR: ', e)
    } 
  }

  componentDidMount() {
    let treeHelper = new TreeHelper(this.props.nodeArray, true)
    this.setState({treeHelper})
    this.initializeDnD(treeHelper);
  }

  initializeDnD(treeHelper) {

    if(typeof document !== 'undefined'){
      console.log(document.querySelectorAll('.nested'))
      let drake = dragula({
        containers: [].slice.apply(document.querySelectorAll('.nested')),
        moves: (el, source, handle, sibling) => {
          return handle.classList.contains('drag-handle')
        },
        accepts: (el, target, source, sibling) => {
          // prevent dragged containers from trying to drop inside itself
          return treeHelper.contains(el, target);
        }
      });
      drake.on('drop', (el, target, source, sibling) => this.handleDrop(el, target, source, sibling));
    }
  }

  componentWillReceiveProps(nextProps){
    if((nextProps.nodeArray.length !== this.props.nodeArray.length) 
      || (nextProps.resourceNamePlural !== this.props.resourceNamePlural)
      || (nextProps.adminResourceMode !== this.props.adminResourceMode)) {
      
      if(nextProps.nodeArray.length > 0) {
        let treeHelper = new TreeHelper(nextProps.nodeArray, true)
        this.setState({treeHelper})
      }
    }
  }
  componentDidUpdate() {
    if(this.props.nodeArray.length > 0) {
      this.initializeDnD(this.state.treeHelper);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.resourceNamePlural !== this.props.resourceNamePlural) {
      return true;
    } else if (nextProps.nodeArray.length !== this.props.nodeArray.length) {
      return true;
    } else if (nextProps.dataLoading !== this.props.dataLoading) {
      return true;
    } else if (nextProps.adminResourceMode !== this.props.adminResourceMode) {
      return true;
    } else if (nextProps.hasChanges !== this.props.hasChanges) {
      return true;
    } else if (nextProps.showSnackbar !== this.props.showSnackbar){
      return true;
    } else {
      return false
    }
  }

  getRootChildren() {
    return this.props.nodeArray.length > 0 ? this.props.nodeArray[0].node.children : [];
  }
  render() {
    let content = (<div className="empty"><h3>No {this.props.resourceNamePlural} yet</h3></div>);

    if(!this.props.dataLoading && this.props.nodeArray.length > 0){
      content = (
        <ListItems items={this.getRootChildren()} 
                   resourceType={this.props.resourceNamePlural} 
                   editMode={this.props.adminResourceMode === 'EDIT_INDEX'} 
                   />)
    }
    return (
      <AdminLayout>
        <div className={"admin-index" + (this.props.adminResourceMode === 'EDIT_INDEX' ? ' index-edit' : '')}>
          <IndexToolbar resourceName={capitalize(this.props.resourceNamePlural)}/>
          {this.props.dataLoading ? (<CircularProgress />) : null}
          <List className="item-list">
            {this.props.dataLoading || !(this.props.nodeArray.length > 0) ? null : <span className="spacer"></span>}
            {this.props.dataLoading ? null : content}
          </List>
        { this.props.children }
        </div>
        <NotificationSnackbar />
      </AdminLayout>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    nodeArray: state.tree.indexTree.nodeArray,
    resourceNamePlural: state.admin.resource.name.plural,
    hasChanges: state.admin.resources[state.admin.resource.name.plural].hasChanges,
    adminResourceMode: state.admin.resources[state.admin.resource.name.plural].mode,
    showSnackbar: state.notifications.snackbar.show,
    dataLoading: state.admin.dataLoading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateIndexHasChanges: (hasChanges, resourceNamePlural) => {
      dispatch({
        type: 'UPDATE_INDEX_HAS_CHANGES',
        hasChanges,
        resourceNamePlural
      })
    },
    updateTree: (nodeArray) => {
      dispatch({
        type: 'UPDATE_TREE',
        nodeArray
      })
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(s)(Index))
