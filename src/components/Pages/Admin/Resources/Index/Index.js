import React from 'react';
import { List } from 'material-ui/List';
import CircularProgress from 'material-ui/CircularProgress';
import IndexItem from './IndexItem'
// import { VelocityTransitionGroup } from 'velocity-react';
// import 'velocity-animate/velocity.ui';
import AdminLayout from '../../Layout/Layout'
import { capitalize } from '../../../../../helpers/StringHelper'
import APIClient from '../../../../../http/requests';

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
        console.log('success')
        console.log(this.state)
        this.setState({items: res.body.data})
        console.log(this.state);
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
  render() {
    console.log(this.state)
    let items = null;

    if(!this.state.loading){
      if(this.state.items.length > 0) {
        items = this.state.items.map((item) => (
          <IndexItem key={item.id} id={item.id} primary={item.primary} secondary={item.secondary} resourceType={this.props.params.resourceNamePlural} />
        ));
      } else {
        items = (<div><h3>No {this.props.params.resourceNamePlural} yet</h3></div>);
      }
    }

    // let listItems = null;

    // if(typeof window !== 'undefined') {
    //   listItems = (
    //     <VelocityTransitionGroup enter={{animation: "transition.slideLeftIn"}}>
    //       {items}
    //     </VelocityTransitionGroup>
    //   )
    // } else {
    //   listItems = items;
    // }

    return (
      <AdminLayout>
        <div className="admin-index">
          <h1>{capitalize(this.props.params.resourceNamePlural)}</h1>
          {this.state.loading ? (<CircularProgress />) : null}
          <List>
            {items}
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

export default Index;