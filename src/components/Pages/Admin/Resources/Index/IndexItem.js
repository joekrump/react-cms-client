import React from 'react'
import { fullBlack } from 'material-ui/styles/colors';
import { ListItem } from 'material-ui/List';
import {fade} from 'material-ui/utils/colorManipulator';
import muiTheme from '../../../../../muiTheme';
import IndexItemActions from './IndexItemActions'
import DragHandleIcon from 'material-ui/svg-icons/editor/drag-handle';

let style = {
  backgroundColor: fade(fullBlack, 0.7)
}

let smallIconStyle = {
  width: '24px',
  height: '24px'
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
    if(this.props.depth > 2) {
      return null;
    }
    let nestedItems = this.props.childItems.map((child, i) => (
      <IndexItem 
        key={`${this.props.resourceType}-${child.id}`}
        id={child.id}
        index={this.props.index + (i + 1)}
        primary={child.primary}
        secondary={child.secondary}
        resourceType={this.props.resourceType}
        deletable={child.deletable}
        childItems={child.children}
        depth={this.props.depth + 1}
        extraData={{...child}}
        editMode={this.props.editMode}
      />
    ))
    return (<div className="nested leaf" 
                 data-depth={this.props.depth + 1}
                 data-index={this.props.index + 1}
                 id={this.props.id}>
                  {nestedItems}
            </div>);
  }
  render(){
    if(this.state.visible) {
      style.opacity = 1;
      style.height = null;
      style.padding = '16px 16px 16px ' + (this.props.editMode ? '56px' : '16px')
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
      <div className="index-item f-no-select"
        data-depth={this.props.depth}
        data-index={this.props.index}>
        <ListItem
          className={"list-item" + (this.props.depth ? ' depth-' +  this.props.depth : '')}
          disabled
          leftIcon={this.props.editMode ? <DragHandleIcon className="drag-handle" color="white" style={smallIconStyle}/> : null}
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