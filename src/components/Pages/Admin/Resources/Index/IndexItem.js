import React from 'react'
import { fullBlack } from 'material-ui/styles/colors';
import { ListItem } from 'material-ui/List';
import {fade} from 'material-ui/utils/colorManipulator';
import muiTheme from '../../../../../muiTheme';
import IndexItemActions from './IndexItemActions'
import DragHandleIcon from 'material-ui/svg-icons/editor/drag-handle';
import { connect } from 'react-redux';

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
    if(nextProps.node.secondary !== this.props.node.secondary) {
      shouldUpdate = true;
    } else if (nextProps.editMode !== this.props.editMode) {
      shouldUpdate = true;
    }
    return shouldUpdate;
  }

  renderNestedItems() {
    // if(this.props.depth > 2) {
    //   return null;
    // }
    if(this.props.node.denyNested && this.props.node.unmovable) {
      return <div className="fake-nested"></div>
    }

    let nestedItems = this.props.node.child_ids.map((childId, i) => (
      <IndexItem 
        key={`${this.props.resourceType}-${childId}`}
        modelId={childId}
        resourceType={this.props.resourceType}
        editMode={this.props.editMode}
      />
    ))
    return (<div className="nested leaf" 
      data-parentModelId={this.props.node.id}>{nestedItems}</div>);
  }
  renderDragHandle() {
    return (this.props.editMode && !this.props.unmovable) ? 
      <DragHandleIcon className="drag-handle" color="white" style={smallIconStyle}/> 
      : null
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


const mapStateToProps = (state, ownProps) => {
  return {
    lookupArray: state.tree.indexTree.lookupArray
    node: state.tree.indexTree.flatNodes[state.tree.indexTree.lookupArray.indexOf(ownProps.modelId)]
  }
}

export default connect(
  mapStateToProps,
  null
)(IndexItem)