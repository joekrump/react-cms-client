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
  margin: 0,
  padding: '12px'
}

class IndexItem extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      visible: true,
      hoverClass: ''
    }
    this.renderNestedItems = this.renderNestedItems.bind(this);
  }

  showItem(visible = false) {
    this.setState({visible});
  }
  
  getItemText(){
    return(
      <div className="inner-text" style={{color: muiTheme.palette.textColor}}>
        <strong className="item-primary">{this.props.node.primary}</strong>
        {this.props.node.secondary ? (<span>&nbsp;-&nbsp;<span className="item-text-secondary">{this.props.node.secondary}</span></span>) 
        : null}
      </div>
    )
  }

  shouldComponentUpdate(nextProps, nextState) {
    let shouldUpdate = false;
    if((nextProps.node) && (nextProps.node.secondary !== this.props.node.secondary)) {
      shouldUpdate = true;
    } else if (nextProps.isEditing !== this.props.isEditing) {
      shouldUpdate = true;
    }
    return shouldUpdate;
  }

  renderNestedItems() {

    if(this.props.node.denyNested && this.props.node.unmovable) {
      return <div className="fake-nested"></div>
    }

    let nestedItems = this.props.node.children.map((childNode, i) => {
      return (<IndexItem 
        key={`${this.props.resourceType}-${childNode.id}`}
        modelId={childNode.id}
        resourceType={this.props.resourceType}
        isEditing={this.props.isEditing}
        node={childNode}
      />)
    })
    return (<div className="nested leaf" data-parentModelId={this.props.node.id}>{nestedItems}</div>);
  }
  renderDragHandle() {
    return (this.props.isEditing && !this.props.node.unmovable) ? 
      <DragHandleIcon className="drag-handle" color="white" style={smallIconStyle}/> 
      : null
  }
  render(){

    if(this.props.node === undefined) {
      return null;
    }

    if(this.state.visible) {
      style.opacity = 1;
      style.height = null;
      style.padding = '16px 16px 16px ' + (this.props.isEditing ? '56px' : '16px')
    } else {
      style.opacity = 0;
      style.height = 0;
      style.padding = 0;
    }
    // console.log(this.props.modelId)
    return(
      <div id={this.props.node.id} className={"index-item card-swipe f-no-select" + (this.props.node.unmovable ? ' unmovable' : '')} >
        <ListItem
          className="list-item"
          disabled
          leftIcon={this.renderDragHandle()}
          rightIconButton={
            <IndexItemActions 
              resourceType={this.props.resourceType} 
              modelId={this.props.node.id} 
              deleteCallback={ this.props.node.deletable ? () => this.showItem() : undefined} 
              deletable={this.props.node.deletable}
              previewPath={this.props.node.previewPath}
            />
          }
          primaryText={this.getItemText()}
          style={{...style}}
        /> 
        { this.props.node.child_ids ? this.renderNestedItems() : null }
      </div>
    );
  }
}

export default IndexItem