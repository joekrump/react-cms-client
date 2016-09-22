import React from 'react';
import Tree from './Tree';
import UITreeNode from './UITreeNode';

class UITree extends React.Component {
  constructor(props) {
    super(props)

    this.state = this.init(props);

    this.dragStart = this.dragStart.bind(this);
    this.drag = this.drag.bind(this);
    this.dragEnd = this.dragEnd.bind(this);
    this.toggleCollapse = this.toggleCollapse.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(!this._updated) this.setState(this.init(nextProps));
    else this._updated = false;
  }

  init(props) {
    var tree = new Tree(props.tree);
    tree.isNodeCollapsed = props.isNodeCollapsed;
    tree.renderNode = props.renderNode;
    tree.changeNodeCollapsed = props.changeNodeCollapsed;
    // tree.updateNodesPosition();

    return {
      tree: tree,
      dragging: {
        index: null,
        x: null,
        y: null,
        w: null,
        h: null
      }
    };
  }

  getDraggingDom() {
    var tree = this.state.tree;
    var dragging = this.state.dragging;

    if(dragging && dragging.index) {
      var draggingStyles = {
        top: dragging.y,
        left: dragging.x,
        width: dragging.w
      };

      return (
        <div className="m-draggable" style={draggingStyles}>
          <UITreeNode
            tree={tree}
            node={this.getArrayNode(dragging.index)}
            index={dragging.index}
            paddingLeft={this.props.paddingLeft}
            showCollapse={this.props.showCollapse}
          />
        </div>
      );
    }

    return null;
  }

  render() {
    var tree = this.state.tree;
    var dragging = this.state.dragging;
    var draggingDom = this.getDraggingDom();

    const style = !this.props.shouldRenderRootNode ? { top: '-36px'  } : {}

    return (
      <div className="m-tree" style={style}>
        {draggingDom}
        <UITreeNode
          tree={tree}
          node={this.getArrayNode(0)}
          index={0}
          key={1}
          paddingLeft={this.props.paddingLeft}
          onDragStart={(index, dom, e) => this.dragStart(index, dom, e)}
          onCollapse={this.toggleCollapse}
          dragging={dragging && dragging.index}
          showCollapse={this.props.showCollapse}
          shouldRenderRootNode={this.props.shouldRenderRootNode}
        />
      </div>
    );
  }

  dragStart(index, dom, e) {
    const { onDragStart } = this.props;
    this.dragging = {
      index,
      w: dom.offsetWidth,
      h: dom.offsetHeight,
      x: dom.offsetLeft,
      y: dom.offsetTop
    };

    this._startX = dom.offsetLeft;
    this._startY = dom.offsetTop;
    this._offsetX = e.clientX;
    this._offsetY = e.clientY;
    this._start = true;

    // create a snapshot of the tree to compare
    const currentNode     = this.getArrayNode(index);
    const parentArrayItem = this.getArrayNode(currentNode.parentIndex);

    if(parentArrayItem && parentArrayItem.childNodeIndexes) {
      this.setState({
        siblings: this.tree.getSiblingItems(index, parentArrayItem)
      });
    } else {
      this.setState({
        siblings: []
      });
    }

    onDragStart && onDragStart(this.getArrayNode(index));

    window.addEventListener('mousemove', this.drag);
    window.addEventListener('mouseup', this.dragEnd);
  }

  // oh
  drag(e) {

    if(this._start) {
      this.setState({
        dragging: this.dragging
      });
      this._start = false;
    }

    const {tree, dragging} = this.state;
    const {paddingLeft} = this.props;

    let newIndex = null;

    let nodeItem = this.getArrayNode(dragging.index);
    const collapsed = nodeItem.node.collapsed;

    const {_startX, _startY, _offsetX, _offsetY} = this;

    const pos = {
      x: _startX + e.clientX - _offsetX,
      y: _startY + e.clientY - _offsetY
    };
    dragging.x = pos.x;
    dragging.y = pos.y;

    let diffX = dragging.x - paddingLeft/2 - (nodeItem.left-2) * paddingLeft;
    let diffY = dragging.y - dragging.h/2 - (nodeItem.top-2) * dragging.h;

    let siblings = tree.getSiblingIndexes(dragging.index, this.getArrayNode(nodeItem.parentIndex));

    if(diffX < 0) { // left
      if(nodeItem.parentIndex && !siblings[1]) {
        newIndex = tree.move(dragging.index, nodeItem.parentIndex, 'after');
      }
    } else if(diffX > paddingLeft) { // right
      if(siblings[0]) {
        var prevNode = siblings[0].node;
        if(!prevNode.collapsed && !prevNode.leaf) {
          newIndex = tree.move(dragging.index, siblings[0], 'append');
        }
      }
    }

    if(newIndex) {
      nodeItem = this.getArrayNode(newIndex);
      nodeItem.node.collapsed = collapsed;
      dragging.index = newIndex;
    }

    if(diffY < 0) { // up
      // var above = tree.getArrayNodeByTop(nodeItem.top - 1 );
      newIndex = tree.move(dragging.index, nodeItem.top - 1, 'before');
    } else if(diffY > dragging.h) { // down
      if(index.next) {
        var below = tree.getIndex(index.next);
        if(below.children && below.children.length && !below.node.collapsed) {
          newIndex = tree.move(dragging.index, index.next, 'prepend');
        } else {
          newIndex = tree.move(dragging.index, index.next, 'after');
        }
      } else {
        // var below = tree.getArrayNodeByTop(nodeItem.top+nodeItem.height);
        if(below && (below.parentIndex !== dragging.index)) {
          if(below.children && below.children.length) {
            newIndex = tree.move(dragging.index, nodeItem.top+nodeItem.height, 'prepend');
          } else {
            newIndex = tree.move(dragging.index, nodeItem.top+nodeItem.height, 'after');
          }
        }
      }
    }

    if(newIndex) {
      nodeItem = this.getArrayNode(newIndex);
      nodeItem.node.collapsed = collapsed;
      dragging.index = newIndex
    }

    this.setState({
      tree: tree,
      dragging: dragging
    });
  }

  dragEnd() {
    const { onDragEnd } = this.props;
    const { tree, dragging: { index } } = this.state;

    const currentNode = this.getArrayNode(index);

    index && onDragEnd && onDragEnd(currentNode);

    // if tree has changed we only trigger change evt
    const parent = index && this.getArrayNode(this.getArrayNode(currentNode.parentIndex));

    if (index && parent && parent.children &&
      (this.state.siblings[0] !== currentNode.prev || this.state.siblings[1] !== currentNode.next)) {
      this.change(tree, currentNode, parent);
    }

    this.setState({
      siblings: [],
      dragging: {
        index: null,
        x: null,
        y: null,
        w: null,
        h: null
      }
    });

    window.removeEventListener('mousemove', this.drag);
    window.removeEventListener('mouseup', this.dragEnd);
  }

  getArrayNode(index) {
    return this.state.tree.getNodeItem(index);
  }

  change(tree, currentNode, parent) {
    this._updated = true;
    if(this.props.onChange) this.props.onChange(tree.obj, currentNode, parent);
  }

  toggleCollapse(nodeId) {
    var tree = this.state.tree;
    var index = tree.getIndex(nodeId);
    var node = index.node;

    if (this.props.onLazyloadNode && node.lazy && node.hasChildren){
      node.lazy = false;
      this.props.onLazyloadNode(node, function(nodes){
        nodes.map(newNode => {
          tree.append(newNode,nodeId);
        });
        this.makeToggleUpdate(node);
      }.bind(this));
    } else {
      this.makeToggleUpdate(node);
    }
  }

  makeToggleUpdate(node) {
    var tree = this.state.tree;
    node.collapsed = !node.collapsed;
    tree.updateNodesPosition();

    this.setState({
      tree: tree
    });

    this.change(tree);
  }
}

UITree.propTypes = {
  tree: React.PropTypes.object.isRequired,
  paddingLeft: React.PropTypes.number,
  renderNode: React.PropTypes.func.isRequired,
  onDragStart: React.PropTypes.func,
  onDragEnd: React.PropTypes.func,
  showCollapse: React.PropTypes.bool,
  shouldRenderRootNode: React.PropTypes.bool
};

UITree.defaultProps = {
  paddingLeft: 20,
  showCollapse: true,
  shouldRenderRootNode: true
};

export default UITree;