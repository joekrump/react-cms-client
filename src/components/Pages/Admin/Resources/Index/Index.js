import React from 'react';
import { List } from 'material-ui/List';
import CircularProgress from 'material-ui/CircularProgress';
import IndexItem from './IndexItem'
import AdminLayout from '../../Layout/AdminLayout'
import { capitalize } from '../../../../../helpers/StringHelper'
import APIClient from '../../../../../http/requests';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './index.scss';
import Dragula from 'react-dragula';
import ListItems from './ListItems';
import TreeHelper from '../../../../../helpers/TreeHelper';
import { connect } from 'react-redux';
import NotificationSnackbar from '../../../../Notifications/Snackbar/Snackbar'

class Index extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = {
      items: [],
      loading: true,
      dragulaDrake: null,
      editMode: false,
      TreeHelper: {},
      changesToSave: false,
      resourcenamePlural: ''
    }
  }
  handleDrop(el, target, source, sibling){
    try {
      let siblingId = sibling ? parseInt(sibling.id) : null;
      // if there is a source then this item is being nested.
      if(source.dataset.parentmodelid) {
        this.state.TreeHelper.updateOrder(parseInt(el.id, 10), siblingId, parseInt(target.dataset.parentmodelid, 10))
      } else {
        // otherwise this is a matter of updating the order of items.
        this.state.TreeHelper.updateOrder(parseInt(el.id, 10), siblingId)
      }
      // previous index, new index, placement
      // console.log('before: ', this.state.TreeHelper.nodeArray);
      
      this.props.updateTree(this.state.TreeHelper.nodeArray);
      this.setState({
        changesToSave: true
      })
      // console.log('after: ', this.state.TreeHelper.nodeArray);
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
        // Set items so that new elements are in the DOM before Dragula is initialized.
        this.setState({
          items: res.body.data,
          TreeHelper: (new TreeHelper(res.body.data))
        }) 

        client.updateToken(res.header.authorization)

        if(typeof document !== 'undefined'){
          let drake = Dragula({
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
    let resourcenamePlural = this.props.params.resourceNamePlural.toLowerCase()
    this.setState({
      resourcenamePlural: resourcenamePlural
    })
    this.setItems(resourcenamePlural);
  }
  componentWillUnmount() {
    this.state.dragulaDrake.destroy();
    this.setState({
      dragulaDrake: null
    })
  }
  componentWillReceiveProps(nextProps){
    // TODO: update how this works by tying into redux
    if(nextProps.params.resourceNamePlural !== this.props.params.resourceNamePlural) {
      this.setItems(nextProps.params.resourceNamePlural);
    }
  }
  saveChanges() {
    // save and then update state to show that no more changes to save.
    //
    let client = new APIClient(this.context.store);

    client.put(this.state.resourcenamePlural + '/update-index', true, {
      data: {
        nodeArray: this.props.nodeArray
      }})
      .then((res) => {
        if (res.statusCode !== 200) {
          this.props.updateSnackbar(true, 'Error', res.data, 'error');
        } else {
          this.props.updateSnackbar(true, 'Success', 'Update Successful', 'success');
        }
      })
      .catch((err) => {
        // Something unexpected happened
        this.props.updateSnackbar(true, 'Error', err, 'error');
      })
    this.setState({
      changesToSave: false
    })
  }
  toggleEditMode(event) {
    event.preventDefault();
    if(this.state.editMode && this.state.changesToSave) {
      // save changes
      this.saveChanges();
    }
    this.setState({
      editMode: !this.state.editMode
    })
  }
  render() {
    let content = null;

    if(!this.state.loading){
      if(this.state.items.length > 0) {
        content = (<ListItems items={this.state.items} resourceType={this.props.params.resourceNamePlural} editMode={this.state.editMode} />)
      } else {
        content = (<div className="empty"><h3>No {this.props.params.resourceNamePlural} yet</h3></div>);
      }
    }
    return (
      <AdminLayout>
        <div className={"admin-index" + (this.state.editMode ? ' index-edit' : '')}>
          <h1>{capitalize(this.props.params.resourceNamePlural)}</h1>
          <button onClick={(event) => this.toggleEditMode(event)}>Adjust Nesting</button>
          {this.state.loading ? (<CircularProgress />) : null}
          <List className="item-list">
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
    updateSnackbar: (show, header, content, notificationType) => {
      dispatch ({
        type: 'NOTIFICATION_SNACKBAR_UPDATE',
        show,
        header,
        content,
        notificationType
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
