import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EditDrawer.scss';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

class EditDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {open: true};
  }

  handleToggle = () => this.setState({open: !this.state.open});

  render() {
    return (
      <div>
        <FloatingActionButton
          className="page-menu floating-menu"
          onTouchTap={this.handleToggle}
        ><SettingsIcon />
        </FloatingActionButton>
        <Drawer width={304} openSecondary={true} open={this.state.open}>
          <AppBar title="Settings" 
            iconElementLeft={<IconButton onTouchTap={this.handleToggle}><NavigationClose /></IconButton>}
          />
          {this.props.children}
        </Drawer>
      </div>
    );
  }
}

export default withStyles(s)(EditDrawer);



