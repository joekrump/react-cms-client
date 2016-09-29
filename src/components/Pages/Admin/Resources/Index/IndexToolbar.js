import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import { connect } from 'react-redux';

class IndexToolbar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: 3,
    };
  }

  render() {
    return (
      <Toolbar style={{backgroundColor: this.context.muiTheme.palette.canvasColor, padding: 0}}>
        <ToolbarGroup>
          <RaisedButton label="Edit" primary={true} style={{margin: '10px 16px'}}/>
        </ToolbarGroup>
      </Toolbar>
    );
  }
}

IndexToolbar.contextTypes = {
  muiTheme: React.PropTypes.object.isRequired
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(s)(IndexToolbar))
