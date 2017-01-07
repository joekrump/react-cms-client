import React from 'react';
import { List } from 'material-ui/List';
import Loader from './Loader';
import AdminLayout from '../../Layout/AdminLayout'
import { capitalize } from '../../../../../helpers/StringHelper'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Index.scss';
import ListItems from './ListItems';
import TreeHelper, { _contains } from '../../../../../helpers/TreeHelper';
import { connect } from 'react-redux';
import NotificationSnackbar from '../../../../Notifications/Snackbar/Snackbar'
import IndexToolbar from './IndexToolbar';

var dragula;

class Index extends React.Component {
  constructor(props, context) {
    super(props);

    this.state = {drake: null, renderNeeded: false}

    this.initializeDnD = this.initializeDnD.bind(this);
  }

  handleDrop(el, target, source, sibling){
    try {
      let siblingId = sibling ? parseInt(sibling.id, 10) : null;

      let treeHelper = new TreeHelper(this.props.flatNodes, true);

      if(source.dataset.parentmodelid) {
        treeHelper.moveNode(parseInt(el.id, 10), siblingId, parseInt(target.dataset.parentmodelid, 10))
      }

      this.props.updateTreeData(treeHelper.flatNodes);
      // if there weren't already changes to save, then indicate that there now are.
      this.props.updateIndexHasChanges(true, this.props.resourceNamePlural)

    } catch (e) {
      console.warn('ERROR: ', e)
    } 
  }

  componentDidMount() {
    dragula = require('react-dragula');
    if(this.props.adminResourceMode === 'EDIT_INDEX') {
      this.initializeDnD(); 
    }
  }

  initializeDnD() {
    // Don't initialize DND until the elements are in the DOM.
    // 
    if((typeof document !== 'undefined') && (document.querySelectorAll('.nested').length > 0)) {

      let drake = dragula({
        containers: [].slice.apply(document.querySelectorAll('.nested')),
        moves: (el, source, handle, sibling) => {
          return handle.classList.contains('drag-handle')
        },
        accepts: (el, target, source, sibling) => {
          // prevent dragged containers from trying to drop inside itself
          return _contains(el, target);
        }
      });
      if(this.state.drake === null) {
        drake.on('drop', (el, target, source, sibling) => this.handleDrop(el, target, source, sibling));
      }
      
      this.setState({drake, renderNeeded: false});
    }
  }

  componentWillUnmount() {
    if(this.state.drake !== null) {
      this.state.drake.destroy();
    }
  }

  componentWillReceiveProps(nextProps){

    if(nextProps.flatNodes.length !== this.props.flatNodes.length
      || nextProps.adminPageType !== this.props.adminPageType) {

      this.setState({renderNeeded: true});
    }
    if(nextProps.adminResourceMode === 'EDIT_INDEX') {
      this.initializeDnD();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    let shouldUpdate = false;

    if(nextProps.resourceNamePlural !== this.props.resourceNamePlural) {
      shouldUpdate = true;
    } else if (nextProps.flatNodes.length !== this.props.flatNodes.length) {
      shouldUpdate = true;
    } else if (nextProps.dataLoading !== this.props.dataLoading) {
      shouldUpdate = true;
    } else if (nextProps.adminResourceMode !== this.props.adminResourceMode) {
      shouldUpdate = true;
    } else if (nextProps.hasChanges || (nextProps.hasChanges !== this.props.hasChanges)) {
      shouldUpdate = true;
    } else if (nextProps.showSnackbar !== this.props.showSnackbar){
      shouldUpdate = true;
    } 
    // else if (!isEqual(nextProps.minimalArray, this.props.minimalArray)) {
    //   console.log('minimalArray differs');
    //   shouldUpdate = true;
    // }
    return shouldUpdate;
  }

  getRootChildNodes() {
    return this.props.flatNodes.length > 1 ? this.props.flatNodes[0].children : [];
  }
  render() {
    let content = (<div className="empty"><h3>No {this.props.resourceNamePlural} yet</h3></div>);

    if(this.props.flatNodes.length > 1){
      content = (
        <ListItems 
          childNodes={this.getRootChildNodes()} 
          resourceType={this.props.resourceNamePlural}
        />
      )
    }
    return (
      <AdminLayout>
        <div className={"admin-index" + (this.props.adminResourceMode === 'EDIT_INDEX' ? ' index-edit' : '')}>
          <IndexToolbar resourceName={capitalize(this.props.resourceNamePlural)}/>
          {this.props.dataLoading ? (<Loader />) : null}
          <List className="item-list">
            {this.props.dataLoading || !(this.props.flatNodes.length > 1) ? null : <span className="spacer"></span>}
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
    dataLoading: state.admin.dataLoading,
    flatNodes: state.tree.indexTree.flatNodes,
    minimalArray: state.tree.indexTree.minimalArray,
    resourceNamePlural: state.admin.resource.name.plural,
    hasChanges: state.admin.resources[state.admin.resource.name.plural].hasChanges,
    adminResourceMode: state.admin.resources[state.admin.resource.name.plural].mode,
    showSnackbar: state.notifications.snackbar.show,
    adminPageType: state.admin.pageType
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
    updateTreeData: (flatNodes) => {
      dispatch({
        type: 'UPDATE_TREE',
        flatNodes
      })
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(s)(Index))
