import React from 'react'
import { fullBlack } from 'material-ui/styles/colors';
import { ListItem } from 'material-ui/List';
import {fade} from 'material-ui/utils/colorManipulator';
import muiTheme from '../../../../../muiTheme';
import IndexItemActions from './IndexItemActions'

let style = {
  backgroundColor: fade(fullBlack, 0.7)
}

class IndexItem extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      visible: true,
      hoverClass: ''
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

  renderNestedItems() {
    let nestedItems = this.props.childItems.map((child) => (
      <IndexItem 
        key={`${this.props.resourceType}-${child.id}`}
        id={child.id}
        primary={child.primary}
        secondary={child.secondary}
        resourceType={this.props.resourceType}
        deletable={child.deletable}
        childItems={child.children}
        depth={child.depth}
        root={!child.depth || child.depth === 0}
        extraData={{...child}}
      />
    ))
    return (<div className="nested">{nestedItems}</div>);
  }
  render(){
    if(this.state.visible) {
      style.opacity = 1;
      style.height = null;
      // style.padding = '16px 16px 16px 16px'
      // style.marginLeft = (this.props.depth * 30) + 'px'
    } else {
      style.opacity = 0;
      style.height = 0;
      style.padding = 0;
    }

    let queryProps = this.props.extraData

    if(this.props.extraData) {  
      delete queryProps.primary;
    }

    return(
      <div className={"index-item f-no-select" + (this.props.root ? ' root' : ' leaf')}>
        <ListItem
          className={"list-item" + (this.props.depth ? ' depth-' +  this.props.depth : '')}
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
        { this.props.childItems ? this.renderNestedItems() : null}
      </div>
    );
  }
}

export default IndexItem;