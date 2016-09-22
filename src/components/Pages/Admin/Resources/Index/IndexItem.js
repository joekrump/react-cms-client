import React from 'react'
import { ListItem } from 'material-ui/List';
import muiTheme from '../../../../../muiTheme';
import IndexItemActions from './IndexItemActions'

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

  render(){
    let style = {};

    if(this.state.visible) {
      style.opacity = 1;
      style.height = null;
      style.cursor = 'move'
      style.paddingLeft = 0;
    } else {
      style.opacity = 0;
      style.height = 0;
      style.padding = 0;
    }

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