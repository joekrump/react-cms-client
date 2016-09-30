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
      items: [],
      loading: true,
      dragulaDrake: null,
      TreeHelper: {}
    }
  }
  handleDrop(el, target, source, sibling){
    try {
      let siblingId = sibling ? parseInt(sibling.id, 10) : null;

      if(source.dataset.parentmodelid) {
        this.state.TreeHelper.updateTree(parseInt(el.id, 10), siblingId, parseInt(target.dataset.parentmodelid, 10))
      }
      
      this.props.updateTree(this.state.TreeHelper.richNodeArray);
      this.props.updateIndexHasChanges(true)
      // console.log('after: ', this.state.TreeHelper.richNodeArray);
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
        this.setState({items: []}) // Reset Items
        console.log('Bad Response: ', res)

      } else {
        // Set items so that new elements are in the DOM before dragula is initialized.
        this.setState({
          items: res.body.data,
          TreeHelper: (new TreeHelper(res.body.data))
        }) 

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

          this.props.updateTree(this.state.TreeHelper.nodeArray);
        }
      }
    }).catch((res) => {
      this.setState({loading: false})
      console.warn('Error: ', res)
      this.setState({items: []}) // Reset Items
    })
  }

  componentDidMount() {
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

  render() {
    let content = null;

    if(!this.state.loading){
      if(this.state.items.length > 0) {
        content = (<ListItems items={this.state.items} resourceType={this.props.resourceNamePlural} editMode={this.props.adminMode === 'EDIT_INDEX'} />)
      } else {
        content = (<div className="empty"><h3>No {this.props.resourceNamePlural} yet</h3></div>);
      }
    }
    return (
      <AdminLayout>
        <div className={"admin-index" + (this.props.adminMode === 'EDIT_INDEX' ? ' index-edit' : '')}>
          <h1>{capitalize(this.props.resourceNamePlural)}</h1>
          <IndexToolbar />
          {this.state.loading ? (<CircularProgress />) : null}
          <List className="item-list">
            {this.state.loading ? null : <span className="spacer"></span>}
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
