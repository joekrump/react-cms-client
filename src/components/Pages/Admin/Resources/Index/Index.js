import React from 'react';
import { List } from 'material-ui/List';
import CircularProgress from 'material-ui/CircularProgress';
import IndexItem from './IndexItem'
import AdminLayout from '../../Layout/AdminLayout'
import { capitalize } from '../../../../../helpers/StringHelper'
import APIClient from '../../../../../http/requests';
// import UITree from '../../../../../ui-tree/UITree'
import Dragula from 'react-dragula';
import s from './Index.scss'
import withStyles from 'isomorphic-style-loader/lib/withStyles';

class Index extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = {
      loading: true,
      tree: {children:[]},
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
        className="node"
        id={node.id} 
        primary={node.primary} 
        secondary={node.secondary} 
        resourceType={this.props.params.resourceNamePlural} 
        deletable={node.deletable}
        depth={node.depth}
      />
    );
  }

  handleTreeChange(tree) {
    console.log(tree);
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
    this.setState({loading: true, tree: {children:[]}})
    let client = new APIClient(this.context.store);

    client.get(resourceNamePlural).then((res) => {
      this.setState({loading: false})

      if(res.statusCode !== 200) {
        this.setState({tree: {children:[]}}) // Reset Items
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

  dragulaDecorator(componentBackingInstance) {
    if (componentBackingInstance) {
      let options = { };
      Dragula([componentBackingInstance], options);
    }
  }

  // <UITree
  //   paddingLeft={30}
  //   tree={this.state.tree}
  //   onChange={(tree) => this.handleTreeChange(tree)}
  //   isNodeCollapsed={this.isNodeCollapsed}
  //   renderNode={(node) => this.renderNode(node)}
  // />
  renderNodes() {
    return this.state.tree.children.map((node) => {
      return this.renderNode(node);
    })
  }
  
  render() {
    return (
      <AdminLayout>
        <div className="admin-index">
          <h1>{capitalize(this.props.params.resourceNamePlural)}</h1>
          <List className="tree" ref={this.dragulaDecorator}>
            {this.renderNodes()}
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