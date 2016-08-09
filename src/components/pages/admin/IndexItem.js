import React from 'react'
import { fullBlack } from 'material-ui/styles/colors';
import { ListItem } from 'material-ui/List';
import {fade} from 'material-ui/utils/colorManipulator';
import muiTheme from '../../../muiTheme';
import IndexItemActions from './IndexItemActions'

import { VelocityComponent } from 'velocity-react';
import 'velocity-animate/velocity.ui';

const IndexItem = React.createClass({

  getInitialState(){
    return {
      visible: true
    }
  },
  hideItem(visible = false) {
    this.setState({visible});
  },
  render(){
    return(
      <VelocityComponent style={{display: 'block'}} animation={{height: this.state.visible ? 50 : 0, opacity: this.state.visible ? 1 : 0}} duration={300}>
        <ListItem
          className="index-list-item"
          disabled
          rightIconButton={<IndexItemActions resourceType={this.props.resourceType} id={this.props.id} deleteCallback={ this.hideItem }/>}
          primaryText={<div style={{color: muiTheme.palette.textColor}}><strong>{this.props.primary}</strong> - <span>{this.props.secondary}</span></div>}
          style={{backgroundColor: fade(fullBlack, 0.7)}}
        />
      </VelocityComponent>
    );
  }
})

export default IndexItem;