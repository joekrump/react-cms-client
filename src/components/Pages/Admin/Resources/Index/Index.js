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

class Index extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = {
      items: [],
      loading: true
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
        this.setState({items: res.body.data})
        client.updateToken(res.header.authorization)
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
  componentWillReceiveProps(nextProps){
    // TODO: update how this works by tying into redux
    if(nextProps.params.resourceNamePlural !== this.props.params.resourceNamePlural) {
      this.setItems(nextProps.params.resourceNamePlural);
    }
  }
  dragulaDecorator(componentBackingInstance) {
    if (componentBackingInstance) {
      // let options = { };
      Dragula([].slice.apply(document.querySelectorAll('.nested')));
    }
  }
  render() {
    let content = null;

    if(!this.state.loading){
      if(this.state.items.length > 0) {
        content = (
          <div className="nested">
            <IndexItem key="index-root" 
              id={0} 
              primary={''} 
              secondary={''} 
              resourceType={this.props.params.resourceNamePlural} 
              deletable={false}
              childItems={this.state.items}
              depth={-1}
              root={true}
            />
          </div>
        )
      } else {
        content = (<div><h3>No {this.props.params.resourceNamePlural} yet</h3></div>);
      }
    }

    return (
      <AdminLayout>
        <div className="admin-index">
          <h1>{capitalize(this.props.params.resourceNamePlural)}</h1>
          {this.state.loading ? (<CircularProgress />) : null}
          <List>
            {content}
          </List>
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