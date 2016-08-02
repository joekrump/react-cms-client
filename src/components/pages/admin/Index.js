import React from 'react';
import { capitalize } from '../../../helpers/string'
import AppConfig from '../../../../config/app'
import request from 'superagent';
import {List, ListItem} from 'material-ui/List';
import {grey400, darkBlack} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import AddButton from './AddButton';

const Index = React.createClass({
  getInitialState() {
    return {
      items: []
    }
  },
  setItems(){
    request.get(AppConfig.apiBaseUrl + (this.props.params.resourceName.toLowerCase()))
      .set('Access-Control-Allow-Origin', AppConfig.baseUrl)
      .set('Authorization', 'Bearer ' + sessionStorage.laravelAccessToken)
      .set('Accept', 'application/json')
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
    this.setItems();
  },
  render() {
    let items = [];

    const iconButtonElement = (
      <IconButton
        touch={true}
        tooltip="option"
        tooltipPosition="bottom-left"
      >
        <MoreVertIcon color={grey400} />
      </IconButton>
    );

    const rightIconMenu = (
      <IconMenu iconButtonElement={iconButtonElement}>
        <MenuItem>Edit</MenuItem>
        <MenuItem>Delete</MenuItem>
      </IconMenu>
    );

    if(this.state.items.length > 0) {
      this.state.items.forEach((item) => {
        items.push((<ListItem
            key={item.id}
             rightIconButton={rightIconMenu}
             primaryText={
              <div><strong>{item.primary}</strong> - <span style={{color: darkBlack}}>{item.secondary}</span></div>
             }
           />))
      })
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