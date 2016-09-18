import FloatingActionButton from 'material-ui/FloatingActionButton'
import Tooltip from 'material-ui/internal/Tooltip'
import React from 'react';
import merge from 'lodash.merge';

class CustomFAB extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hoveredTooltip: false
    }
  }
  // Get default styles merged with prop styles.
  getStyles() {
    let styles = {
      lineHeight: '32px',
      position: 'relative',
      display: 'inline-block',
      marginBottom: '16px',
      marginTop: '-8px'
    };

    return merge(this.props.style, styles);
  }

  render() {
    return (
      <div className="action">
        <button className={"button"} >
          <FloatingActionButton 
            onMouseEnter={()=>{this.setState({hoveredTooltip: true})}}
            onMouseLeave={()=>{this.setState({hoveredTooltip: false})}}
            {...this.props}
          >
            {this.props.icon ? (this.props.icon) : null}
          </FloatingActionButton>

        </button>
        <Tooltip 
          className="tooltip"
          show={this.state.hoveredTooltip}
          label={this.props.tooltipText}
          horizontalPosition="left"
          verticalPosition="middle"
          touch={true}
          style={this.getStyles()}
        />
      </div>
    )
  }
};

export default CustomFAB;