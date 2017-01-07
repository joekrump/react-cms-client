import React from 'react'
import { fullBlack } from 'material-ui/styles/colors';
import { ListItem } from 'material-ui/List';
import {fade} from 'material-ui/utils/colorManipulator';
import muiTheme from '../../../../../muiTheme';
import IndexItemActions from './IndexItemActions'
import DragHandleIcon from 'material-ui/svg-icons/editor/drag-handle';
import ArrowUpIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import ArrowDownIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import AddNestedItemButton from './AddNestedItemButton';
import DraftLabel from './DraftLabel';

let itemStyle = {
  backgroundColor: fade(fullBlack, 0.7)
}

let smallIconStyle = {
  margin: '8px 0',
  padding: '12px 6px',
}

const buttonStyles = {
  smallIcon: {
    width: 24,
    height: 24,
  },
  buttonStyles: {
    width: 36,
    height: 36,
    padding: 6
  }
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

  // shouldComponentUpdate(nextProps) {
  //   if(nextProps.isEditing)
  // }

  
  getItemText(){
    return(
      <div className={`inner-text ${this.props.resourceType}`} style={{color: muiTheme.palette.textColor}}>
        <span className="item-primary">
          <strong>{this.props.primary}</strong>
        </span>
        { this.props.draft === undefined ? null : (<DraftLabel isDraft={this.props.draft} resourceId={this.props.id}/>) }
        { this.props.secondary ? (<span>&nbsp;-&nbsp;<span className="item-text-secondary">{this.props.secondary}</span></span>) 
        : null }
      </div>
    )
  }

  renderCollapseIcon() {
    return this.state.collapsed ? <ArrowDownIcon color="white" style={{...smallIconStyle, cursor: 'pointer'}} onClick={(e) => this.toggleCollapsed(e)}/>
      : <ArrowUpIcon color="white" style={{...smallIconStyle, cursor: 'pointer'}} onClick={(e) => this.toggleCollapsed(e)} />;
  }

  renderDragHandle() {
    if (this.props.isEditing && !this.props.unmovable) {
      if (this.props.isParent) {
        return (
          <div style={{width: 80, margin: 0}}>
            <DragHandleIcon className="drag-handle" color="white" style={smallIconStyle}/>
            {this.renderCollapseIcon()}
          </div>
        );
      } else {
        return <DragHandleIcon className="drag-handle" color="white" style={smallIconStyle}/>
      }
    } else {
      return this.props.isParent ? this.renderCollapseIcon() : null;
    }
  }

  renderChildren() {
    if(this.props.children === undefined) {
      return null;
    }

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

  renderExtraActionButtons() {
    if(this.props.children === undefined) {
      return null;
    }
    return <AddNestedItemButton parentModelId={this.props.modelId} resourceType={this.props.resourceType} styles={buttonStyles}/>
  }

  toggleCollapsed(e) {
    if (!this.props.child_ids) {
      return null;
    }
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  getLeftPaddingAmount() {
    if(this.props.isEditing && this.props.isParent) {
      return 90;
    } else if(this.props.isEditing || this.props.isParent) {
      return 44;
    } else {
      return 16;
    }
  }

  render(){
    if(!this.props.modelId) {
      return null
    }

    if(this.state.visible) {
      itemStyle.opacity = 1;
      itemStyle.height = null;
      itemStyle.padding = `16px 16px 16px ${this.getLeftPaddingAmount()}px`
    } else {
      itemStyle.opacity = 0;
      itemStyle.height = 0;
      itemStyle.padding = 0;
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
            >
              {this.renderExtraActionButtons()}
            </IndexItemActions>
          }
          primaryText={this.getItemText()}
          style={itemStyle}
        />
        { this.renderChildren() }
      </div>
    );
  }
}

export default IndexItem;
