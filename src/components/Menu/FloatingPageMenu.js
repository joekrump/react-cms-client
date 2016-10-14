import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './FloatingPageMenu.scss';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';

class FloatingPageMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {open: false};
  }

  handleToggle = () => this.setState({open: !this.state.open});

  render() {
    return (
      <div>
        <RaisedButton
          className="page-menu floating-menu"
          label="Toggle Drawer"
          onTouchTap={this.handleToggle}
        />
        <Drawer width={346} openSecondary={true} open={this.state.open}>
          <AppBar title="AppBar" />
          {this.props.children}
        </Drawer>
      </div>
    );
  }
}

export default withStyles(s)(FloatingPageMenu);



