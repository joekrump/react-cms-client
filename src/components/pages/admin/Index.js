import React from 'react';
import { capitalize } from '../../../helpers/string'
import AppConfig from '../../../../app_config/app'
import request from 'superagent';
import { List } from 'material-ui/List';
import AddResourceButton from './AddButton';
import CircularProgress from 'material-ui/CircularProgress';
import IndexItem from './IndexItem'

import { VelocityTransitionGroup } from 'velocity-react';
import 'velocity-animate/velocity.ui';

const Index = React.createClass({
  getInitialState() {
    return {
      items: [],
      loading: true
    }
  },
  setItems(resourceNamePlural){
    this.setState({loading: true})
    request.get(AppConfig.apiBaseUrl + resourceNamePlural)
      .set('Authorization', 'Bearer ' + sessionStorage.laravelAccessToken)
      .end(function(err, res) {
        this.setState({loading: false})
        if(err){
          this.setState({items: []}) // Reset Items
        } else if(res.statusCode !== 200) {
          this.setState({items: []}) // Reset Items
        } else {
          this.setState({items: res.body.data})
        }

      }.bind(this))
  },
  componentDidMount() {
    this.setItems(this.props.params.resourceNamePlural.toLowerCase());
  },
  componentWillReceiveProps(nextProps){
    // TODO: update how this works by tying into redux
    if(nextProps.params.resourceNamePlural !== this.props.params.resourceNamePlural) {
      this.setItems(nextProps.params.resourceNamePlural);
    }
  },
  render() {
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

    return (

      <div className="admin-index">
        <h1>{capitalize(this.props.params.resourceNamePlural)}</h1>
          {this.state.loading ? (<CircularProgress />) : null}
          <List>
            <VelocityTransitionGroup enter={{animation: "transition.slideLeftIn"}}>
              {items}
            </VelocityTransitionGroup>
          </List>
        
        { this.props.children }
        <AddResourceButton />
      </div>
    );
  }
});
export default Index;