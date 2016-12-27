import React from 'react'
import { fullBlack } from 'material-ui/styles/colors';
import { ListItem } from 'material-ui/List';
import {fade} from 'material-ui/utils/colorManipulator';
import muiTheme from '../../../../../muiTheme';
import IndexItemActions from './IndexItemActions'
import DragHandleIcon from 'material-ui/svg-icons/editor/drag-handle';
import ArrowUpIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import ArrowDownIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-down';

let style = {
  backgroundColor: fade(fullBlack, 0.7)
}

let smallIconStyle = {
  margin: 0,
  padding: '12px',
  cursor: 'pointer',
}

class IndexItem extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      visible: (this.props.depth === 1),
      hoverClass: '',
      collapsed: this.props.collapsed,
    }
    this.renderChildren = this.renderChildren.bind(this);
  }

  showItem(visible = false) {
    this.setState({visible});
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.visible !== nextProps.vsiible) {
      this.setState({visible: nextProps.visible})
    }
  }
  
  getItemText(){
    return(
      <div className="inner-text" style={{color: muiTheme.palette.textColor}}>
        <span className="item-primary">
          <strong>{this.props.primary}</strong>
        </span>
        {this.props.secondary ? (<span>&nbsp;-&nbsp;<span className="item-text-secondary">{this.props.secondary}</span></span>) 
        : null}
      </div>
    )
  }

  renderCollapseIcon() {
    return this.state.collapsed ? <ArrowDownIcon color="white" style={smallIconStyle} onClick={(e) => this.toggleCollapsed(e)}/>
      : <ArrowUpIcon color="white" style={smallIconStyle} onClick={(e) => this.toggleCollapsed(e)}/>;
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   let shouldUpdate = false;

  //   if (nextProps.isEditing !== this.props.isEditing) {
  //     shouldUpdate = true;
  //   } else if (nextProps.secondary !== this.props.secondary) {

  //     shouldUpdate = true;
  //   }
  //   return shouldUpdate;
  // }

  renderChildren() {

    if(this.props.denyNested && this.props.unmovable) {
      return <div className="fake-nested"></div>
    }

    let nestedItems = this.props.children.map((childNode, i) => {
      childNode.depth = (this.props.depth + 1);
      return (<IndexItem 
        key={`${this.props.resourceType}-${childNode.id}`}
        modelId={childNode.id}
        resourceType={this.props.resourceType}
        isEditing={this.props.isEditing}
        visible={!this.state.collapsed}
        collapsed={true}
        isParent={(childNode.child_ids && (childNode.child_ids.length > 0))}
        {...childNode}
      />)
    })
    return (<div className={`nested leaf ${this.state.collapsed ? 'collapsed' : ''}`} data-parentModelId={this.props.modelId}>{nestedItems}</div>);
  }

  toggleCollapsed(e) {
    if (!this.props.child_ids) {
      return null;
    }
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  renderDragHandle() {
    return (this.props.isEditing && !this.props.unmovable) ? 
      <DragHandleIcon className="drag-handle" color="white" style={smallIconStyle}/> 
      : (this.props.isParent ? this.renderCollapseIcon() : null)
  }


  render(){
    if(!this.props.modelId) {
      return null
    }

    if(this.state.visible) {
      style.opacity = 1;
      style.height = null;
      style.padding = '16px 16px 16px ' + (this.props.isEditing || this.props.isParent ? '56px' : '16px')
    } else {
      style.opacity = 0;
      style.height = 0;
      style.padding = 0;
    }

    return(
      <div id={this.props.id} className={"index-item card-swipe" + (this.props.unmovable ? ' unmovable' : '')} >
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
        { this.renderChildren() }
      </div>
    );
  }
}

export default IndexItem;
