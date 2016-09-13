import React from 'react'
import { fullBlack } from 'material-ui/styles/colors';
import { ListItem } from 'material-ui/List';
import {fade} from 'material-ui/utils/colorManipulator';
import muiTheme from '../../../../../muiTheme';
import IndexItemActions from './IndexItemActions'

// import { VelocityComponent } from 'velocity-react';
import 'velocity-animate/velocity.ui';

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
      <div style={{color: muiTheme.palette.textColor}}><strong>{this.props.primary}</strong>{this.props.secondary ? (<span> -&nbsp;{this.props.secondary}</span>) : null}</div>
    )
  }

  render(){
    /*<VelocityComponent style={{display: 'block'}} animation={{height: this.state.visible ? 50 : 0, opacity: this.state.visible ? 1 : 0}} duration={300}>*/
    return(
        <ListItem
          className="index-list-item"
          disabled
          rightIconButton={<IndexItemActions resourceType={this.props.resourceType} id={this.props.id} deleteCallback={ () => this.showItem() }/>}
          primaryText={this.getText()}
          style={{backgroundColor: fade(fullBlack, 0.7)}}
        />

    );
  }
}

export default IndexItem;