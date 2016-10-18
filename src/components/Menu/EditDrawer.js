import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EditDrawer.scss';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

const appBarStyle = {
  marginBottom: 7
}

class EditDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {open: true};
  }

  renderToggleButton() {
    return this.state.open ? null 
      : (
          <FloatingActionButton
            className="page-menu floating-menu floating-menu-button"
            onTouchTap={this.handleToggle}>
            <SettingsIcon />
          </FloatingActionButton>
        )
  }

  handleToggle = () => this.setState({open: !this.state.open});

  render() {
    return (
      <div>
        {this.renderToggleButton()}
        <Drawer width={304} openSecondary={true} open={this.state.open} onRequestChange={() => this.handleToggle()}>
          <AppBar title="Settings" 
            style={appBarStyle}
            iconElementLeft={<IconButton onTouchTap={this.handleToggle}><NavigationClose /></IconButton>}
          />
          {this.props.children}
        </Drawer>
      </div>
    );
  }
}

export default withStyles(s)(EditDrawer);



