import React from 'react';
import ReactDOM from 'react-dom';

export default class UITreeNode extends React.Component {
  constructor() {
    super();

    this.handleCollapse = this.handleCollapse.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
  }

  renderCollapse() {
    const {node} = this.props;

    if (node.node.hasChildren || (node.childNodeIndexes && node.childNodeIndexes.length)) {
      var collapsed = node.node.collapsed;

      return (
        <span
          className={'collapse ' + (collapsed ? 'caret-right' : 'caret-down')}
          onMouseDown={(e) => {e.stopPropagation()}}
          onClick={this.handleCollapse}>
        </span>
      );
    }

    return null;
  }

  renderChildren() {
    const {
      showCollapse = true, 
      node, 
      index,
      tree, 
      dragging, 
      paddingLeft, 
      onCollapse, 
      onDragStart, 
      shouldRenderRootNode
    } = this.props;

    if(node.childNodeIndexes && node.childNodeIndexes.length) {
      const childrenStyles = {};
      if(node.node.collapsed) childrenStyles.display = 'none';
      childrenStyles['paddingLeft'] = (this.isRoot(node) && ! shouldRenderRootNode ? 0 : paddingLeft  ) + 'px';

      return (
        <div className="children" style={childrenStyles}>
          {node.childNodeIndexes.map((index) => {
            var nodeItem = tree.getNodeItem(index);
            return (
              <UITreeNode
                tree={tree}
                node={nodeItem}
                index={index}
                key={index}
                dragging={dragging}
                paddingLeft={paddingLeft}
                onCollapse={onCollapse}
                onDragStart={onDragStart}
                showCollapse={showCollapse}
                shouldRenderRootNode={shouldRenderRootNode}
              />
            );
          })}
        </div>
      );
    }

    return null;
  }

  renderInner(){
    if (this.isRoot() && ! this.props.shouldRenderRootNode) return <div style={{height: '36px'}}></div>

    return(
        <div className="inner" ref="inner" onMouseDown={this.handleMouseDown}>
          {this.props.showCollapse && this.renderCollapse()}
            { this.props.tree.renderNode(this.props.node.node) }
        </div>
     )
  }

  isRoot(){
    const {index : {index}} = this.props;
    return index === 0 ? true : false;
  }

  render() {
    const { index : { index }, dragging } = this.props;
    var styles = {};

    return (
      <div className={'m-node' + (index === dragging ? ' placeholder' : ' ')} style={styles}>
        {this.renderInner()}
        {this.renderChildren()}
      </div>
    );
  }

  handleCollapse(e) {
    e.stopPropagation();

    // const {index : {id: nodeId}, onCollapse} = this.props;
    if(this.props.onCollapse) onCollapse(this.props.index);
  }

  handleMouseDown(e) {
    // const {index: {id: nodeId}} = this.props;
    const dom = this.refs.inner;

    if(this.props.onDragStart) {
      this.props.onDragStart(this.props.index, dom, e);
    }
  }
}