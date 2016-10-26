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
    this.renderChildren = this.renderChildren.bind(this);
  }

  showItem(visible = false) {
    this.setState({visible});
  }
  
  getItemText(){
    return(
      <div className="inner-text" style={{color: muiTheme.palette.textColor}}>
        <strong className="item-primary">{this.props.primary}</strong>
        {this.props.secondary ? (<span>&nbsp;-&nbsp;<span className="item-text-secondary">{this.props.secondary}</span></span>) 
        : null}
      </div>
    )
  }

  shouldComponentUpdate(nextProps, nextState) {
    let shouldUpdate = false;

    if (nextProps.isEditing !== this.props.isEditing) {
      console.log('editing context changed')
      shouldUpdate = true;
    } else if (nextProps.secondary !== this.props.secondary) {
      shouldUpdate = true;
    }
    console.log('SHOULD INDEX ITEM UPDATE: ', shouldUpdate);
    return shouldUpdate;
  }

  renderChildren() {
    if(this.props.denyNested && this.props.unmovable) {
      return <div className="fake-nested"></div>
    }

    let nestedItems = this.props.children.map((childNode, i) => {
      return (<IndexItem 
        key={`${this.props.resourceType}-${childNode.id}`}
        modelId={childNode.id}
        resourceType={this.props.resourceType}
        isEditing={this.props.isEditing}
        {...childNode}
      />)
    })
    return (<div className="nested leaf" data-parentModelId={this.props.modelId}>{nestedItems}</div>);
  }
  renderDragHandle() {
    return (this.props.isEditing && !this.props.unmovable) ? 
      <DragHandleIcon className="drag-handle" color="white" style={smallIconStyle}/> 
      : null
  }
  render(){

    if(!this.props.modelId) {
      return null
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
      <div id={this.props.id} className={"index-item card-swipe f-no-select" + (this.props.unmovable ? ' unmovable' : '')} >
        <ListItem
          className="list-item"
          disabled
          leftIcon={this.renderDragHandle()}
          rightIconButton={
            <IndexItemActions 
              resourceType={this.props.resourceType} 
              modelId={this.props.modelId} 
              deleteCallback={ this.props.deletable ? () => this.showItem() : undefined} 
              deletable={this.props.deletable}
              previewPath={this.props.previewPath}
            />
          }
          primaryText={this.getItemText()}
          style={{...style}}
        /> 
        { this.props.child_ids ? this.renderChildren() : null }
      </div>
    );
  }
}

export default IndexItem;