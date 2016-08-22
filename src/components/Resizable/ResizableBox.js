// @flow
import {default as React, PropTypes} from 'react';
import Resizable from './Resizable';
import './Resizable.css'

type State = {aspectRatio: number};
type Size = {width: number, height: number};
type ResizeData = {element: Element, size: Size};

// An example use of Resizable.
export default class ResizableBox extends React.Component {

  static defaultProps = {
    handleSize: [20,20]
  };

  state: State = {
    width: this.props.width,
    height: this.props.height,
  };

  getChildRatio(width, height) {
    return width / height;
  }

  componentWillReceiveProps(nextProps) {
    if((nextProps.width < this.props.maxConstraints[0]) && (nextProps.height < this.props.maxConstraints[1])){
      this.setState({
        width: nextProps.width,
        height: nextProps.height
      })
    } else if(nextProps.width > nextProps.height){
      this.setState({
        width: this.props.maxConstraints[0],
        height: (this.props.maxConstraints[0] / (this.getChildRatio(nextProps.width, nextProps.height)))
      })
    } else {
      this.setState({
        width: (this.props.maxConstraints[1] * (this.getChildRatio(nextProps.width, nextProps.height))),
        height: this.props.maxConstraints[1]
      })
    }
  }

  onResize = (event, {element, size}) => {
    const {width, height} = size;

    this.setState(size, () => {
      this.props.onResize && this.props.onResize(event, {element, size});
    });
  };
  onResize: (event: Event, data: ResizeData) => void;

  render(): React.Element {
    // Basic wrapper around a Resizable instance.
    // If you use Resizable directly, you are responsible for updating the child component
    // with a new width and height.
    const {handleSize, onResizeStart, onResizeStop, draggableOpts,
         minConstraints, maxConstraints, lockAspectRatio, width, height, resizeHandleColor, ...props} = this.props;
    return (
      <Resizable
        handleSize={handleSize}
        width={this.state.width}
        height={this.state.height}
        onResizeStart={onResizeStart}
        onResize={this.onResize}
        onResizeStop={onResizeStop}
        draggableOpts={draggableOpts}
        minConstraints={minConstraints}
        maxConstraints={maxConstraints}
        lockAspectRatio={lockAspectRatio}
        resizeHandleColor={resizeHandleColor}
        >
        <div style={{width: this.state.width + 'px', height: this.state.height + 'px'}} {...props} />
      </Resizable>
    );
  }
}