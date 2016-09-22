import React from 'react';
import { List } from 'material-ui/List';
import CircularProgress from 'material-ui/CircularProgress';
import IndexItem from './IndexItem'
import AdminLayout from '../../Layout/AdminLayout'
import { capitalize } from '../../../../../helpers/StringHelper'
import APIClient from '../../../../../http/requests';
import Tree from 'react-ui-tree'
import s from './Index.scss'
import withStyles from 'isomorphic-style-loader/lib/withStyles';

class Index extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = {
      loading: true,
      tree: {},
      active: null,
      treeModified: false
    }
  }

  renderNode(node) {
    if(!node.id){
      return null;
    }
    return (
      <IndexItem key={node.id} 
        className={'node' + (node === this.state.active ? ' is-active' : '')}
        id={node.id} 
        primary={node.primary} 
        secondary={node.secondary} 
        resourceType={this.props.params.resourceNamePlural} 
        deletable={node.deletable}
        depth={node.depth}
        onTouchTap={this.onTouchTapNode.bind(null, node)}
      />
    );
  }

  handleTreeChange(tree) {
    this.setState({
      tree: tree,
      treeModified: true
    });
  }

  onTouchTapNode(node) {
    this.setState({
      active: node
    });
  }

  setItems(resourceNamePlural){
    this.setState({loading: true, tree: {}})
    let client = new APIClient(this.context.store);

    client.get(resourceNamePlural).then((res) => {
      this.setState({loading: false})

      if(res.statusCode !== 200) {
        this.setState({tree: {}}) // Reset Items
        console.log('Bad Response: ', res)
      } else {
        this.setState({tree: {children: res.body.data}})
        client.updateToken(res.header.authorization)
      }
    }).catch((res) => {
      this.setState({loading: false})
      console.warn('Error: ', res)
      this.setState({tree: {}}) // Reset Items
    })
  }
  componentDidMount() {
    this.setItems(this.props.params.resourceNamePlural.toLowerCase());
  }
  componentWillReceiveProps(nextProps){
    // TODO: update how this works by tying into redux
    if(nextProps.params.resourceNamePlural !== this.props.params.resourceNamePlural) {
      this.setItems(nextProps.params.resourceNamePlural);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(nextState.treeModified) {
      return false;
    }
    return true;
  }

  render() {
    return (
      <AdminLayout>
        <div className="admin-index">
          <h1>{capitalize(this.props.params.resourceNamePlural)}</h1>
          <List className="tree">
            <Tree
              paddingLeft={30}
              tree={this.state.tree}
              onChange={(tree) => this.handleTreeChange(tree)}
              isNodeCollapsed={this.isNodeCollapsed}
              renderNode={(node) => this.renderNode(node)}
            />
          </List>
          { this.state.loading ? (<CircularProgress />) : null }
        { this.props.children }
        </div>
      </AdminLayout>
    );
  }
}

Index.contextTypes = {
  store: React.PropTypes.object
}

export default withStyles(s)(Index);