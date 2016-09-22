import React from 'react'
import { fullBlack } from 'material-ui/styles/colors';
import { ListItem } from 'material-ui/List';
import {fade} from 'material-ui/utils/colorManipulator';
import muiTheme from '../../../../../muiTheme';
import IndexItemActions from './IndexItemActions'
// import { VelocityComponent } from 'velocity-react';
// import 'velocity-animate/velocity.ui';

let style = {
  backgroundColor: fade(fullBlack, 0.7)
}

class IndexItem extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      visible: true
    }
  }

  showItem(visible = false) {
    this.setState({visible});
  }
  
  getText(){
    return(
      <div className="inner-text" style={{color: muiTheme.palette.textColor}}><strong>{this.props.primary}</strong>{this.props.secondary ? (<span> -&nbsp;{this.props.secondary}</span>) : null}</div>
    )
  }

  getDepth(){
    return this.props.depth ? this.props.depth :  0;
  }

  render(){

    if(this.state.visible) {
      style.opacity = 1;
      style.height = null;
      style.padding = '16px 16px 16px 16px'
      style.marginLeft = (this.getDepth() * 30) + 'px'
      style.cursor = 'move'
    } else {
      style.opacity = 0;
      style.height = 0;
      style.padding = 0;
    }

    let queryProps = this.props.extraData

    delete queryProps.primary;
    return(
      <div className="index-item-container">
        <ListItem
          className="index-list-item"
          disabled
          rightIconButton={
            <IndexItemActions 
              resourceType={this.props.resourceType} 
              id={this.props.id} 
              deleteCallback={ this.props.deletable ? () => this.showItem() : undefined} 
              queryProps={{...queryProps}}
              deletable={this.props.deletable}
            />
          }
          primaryText={this.getText()}
          style={{...style}}
        />
      </div>
    );
  }
}

export default IndexItem;