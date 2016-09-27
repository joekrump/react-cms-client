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

class Index extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = {
      items: [],
      loading: true,
      dragulaDrake: null,
      editMode: false,
      TreeHelper: {}
    }
  }
  handleDrop(el, target, source, sibling){
    try {
      console.log('DROPPED!')
      // console.log('Element Index: ', el.dataset.index)
      // console.log('Sibling Index: ', sibling.dataset.index);
      // previous index, new index, placement
      console.log('before: ', this.state.TreeHelper.nodeArray);
      this.state.TreeHelper.move(el.dataset.index, (sibling.dataset.index - 1), 'prepend')
      console.log('after: ', this.state.TreeHelper.nodeArray);
    } catch (e) {
      console.warn('ERROR: ', e)
    } 
  }
  handleOver(el, container, source){
    // Nesting
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
        this.setState({items: res.body.data}) 

        client.updateToken(res.header.authorization)
        if(typeof document !== 'undefined'){
          let drake = Dragula({
            containers: [].slice.apply(document.querySelectorAll('.nested')),
            moves: (el, source, handle, sibling) => {
              return handle.classList.contains('drag-handle')
            }
          });
          drake.on('drop', (el, target, source, sibling) => this.handleDrop(el, target, source, sibling));
          drake.on('over', (el, container, source) => this.handleOver(el, container, source));

          this.setState({
            dragulaDrake: drake,
            TreeHelper: (new TreeHelper(res.body.data))
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
    this.setItems(this.props.params.resourceNamePlural.toLowerCase());
  }
  componentWillUnmount() {
    this.state.dragulaDrake.destroy();
    this.state.dragulaDrake.setState({
      dragulaDrake: null
    })
  }
  componentWillReceiveProps(nextProps){
    // TODO: update how this works by tying into redux
    if(nextProps.params.resourceNamePlural !== this.props.params.resourceNamePlural) {
      this.setItems(nextProps.params.resourceNamePlural);
    }
  }
  toggleEditMode(event) {
    event.preventDefault();
    this.setState({
      editMode: !this.state.editMode
    })
  }
  render() {
    let content = null;
    // console.log(this.state.TreeHelper.nodeArray)

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
      </AdminLayout>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    nodeArray: state.tree.indexTree.nodeArray
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateTree: (nodeArray) => {
      dispatch ({
        type: 'UPDATE_TREE',
        nodeArray
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
