import React from 'react';
import { capitalize } from '../../../helpers/string'
import AppConfig from '../../../../config/app'
import request from 'superagent';

const Index = React.createClass({
  getInitialState() {
    return {
      items: []
    }
  },
  componentWillMount() {
    // TODO check if the resource is valid or not and redirect to a different page if it is not.
    if(!AppConfig.validResources.includes(this.props.params.resourceName)) {
      console.log('not a valid resource')
    }
  },
  componentDidMount(){
    request.get(AppConfig.apiBaseUrl + (this.props.params.resourceName.toLowerCase()))
      .set('Access-Control-Allow-Origin', AppConfig.baseUrl)
      .set('Accept', 'application/json')
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
    // get items
  },
  render() {
    let items = [];

    if(this.state.items.length > 0) {
      this.state.items.forEach((item) => {
        items.push((<li key={item.id}>{item.email}</li>))
      })
    }

    return (

      <div className="admin-index">
        <h1>Index Page for {capitalize(this.props.params.resourceName)}</h1>
        <ul>
        { items }
        </ul>
        { this.props.children }
      </div>
    );
  }
  
});
export default Index;