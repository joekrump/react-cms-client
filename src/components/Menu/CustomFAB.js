import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton'
import Tooltip from 'material-ui/internal/Tooltip'
import merge from 'lodash.merge';

class CustomFAB extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hoveredTooltip: false
    }
  }
  // Get default styles merged with prop styles.
  getToolTipStyles() {
    let styles = {
      lineHeight: '32px',
      position: 'relative',
      display: 'inline-block',
      marginBottom: '16px',
      marginTop: '-8px', // marginTop and top should add up to be the height of the action element that contains them.
      top: '34px',
      zIndex: 2000
    };

    return merge(styles, this.props.toolTypeStyles);
  }

  render() {

    return (
      <div className={this.props.className ? this.props.className : "action"}>
        <div className="button" style={{transitionDelay: this.props.delay + 'ms'}}>
          <FloatingActionButton 
            onMouseEnter={()=>{this.setState({hoveredTooltip: true})}}
            onMouseLeave={()=>{this.setState({hoveredTooltip: false})}}
            iconStyle={this.props.iconStyle}
            secondary={this.props.secondary}
            mini={this.props.mini}
          >
            {this.props.icon ? (this.props.icon) : null}
          </FloatingActionButton>

        </div>
        <Tooltip 
          className="tooltip"
          show={this.state.hoveredTooltip}
          label={this.props.tooltipText}
          horizontalPosition="left"
          verticalPosition="top"
          touch={true}
          style={this.getToolTipStyles()}
        />
      </div>
    )
  }
};

export default CustomFAB;