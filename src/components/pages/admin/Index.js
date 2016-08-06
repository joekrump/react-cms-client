import React from 'react';
import { capitalize } from '../../../helpers/string'
import AppConfig from '../../../../app_config/app'
import request from 'superagent';
import { List } from 'material-ui/List';
import { grey400 } from 'material-ui/styles/colors';
import MenuItem from '../../Menu/MenuItem';
import AddButton from './AddButton';
import CircularProgress from 'material-ui/CircularProgress';
import IndexItem from './IndexItem'

const Index = React.createClass({
  getInitialState() {
    return {
      items: null
    }
  },
  setItems(resourceName){
    this.setState({items: null});

    request.get(AppConfig.apiBaseUrl + resourceName)
      .set('Access-Control-Allow-Origin', AppConfig.baseUrl)
      .set('Authorization', 'Bearer ' + sessionStorage.laravelAccessToken)
      .end(function(err, res) {
        if(err){
          console.log("error", err);
        } else if(res.statusCode !== 200) {
          console.log('errorCode', res);
        } else {
          console.log(res);
          this.setState({items: res.body.items})
        }
      }.bind(this))
  },
  componentDidMount() {
    this.setItems(this.props.params.resourceName.toLowerCase());
  },
  componentWillReceiveProps(nextProps){
    // TODO: update how this works by tying into redux
    if(nextProps.params.resourceName !== this.props.params.resourceName) {
      this.setItems(nextProps.params.resourceName);
    }
  },
  render() {
    let items = [];

    if(this.state.items === null) {
      items = (<div><h3>Loading:</h3><CircularProgress /></div>);
    } else if(this.state.items.length > 0) {
      items = this.state.items.map((item) => (<IndexItem key={item.id} id={item.id} primary={item.primary} secondary={item.secondary} resourceType={this.props.params.resourceName} />));
    } else {
      items = (<div><h3>No {this.props.params.resourceName} yet</h3></div>);
    }

    return (
      <div className="admin-index">
        <h1>Index Page for {capitalize(this.props.params.resourceName)}</h1>
        <List>
          {items}
        </List>
        { this.props.children }
        <AddButton />
      </div>
    );
  }
});
export default Index;