// src/components/Nav/AdminNav.js
import React from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import AppConfig from '../../../app_config/app';
import auth from '../../auth';
import MenuItem from '../Menu/MenuItem';
import BackButton from './BackButton';
import AdminMenu from '../Menu/AdminMenu';

class AdminNav extends React.Component {

  constructor(props) {
    super(props);
    this.state = { menuOpen: true };
  }

  toggleMenu() {
    this.setState({
      menuOpen: !this.state.menuOpen
    });
  }

  closeMenu() {
    this.setState({menuOpen: false});
  }

  handleLogout(e){
    e.preventDefault();
    auth.logout(() => {
      // dispatch an action if the server has successfully logged out the user.
      this.props.logoutUser("/login");
    }, () => {
      this.props.loginUser(auth.getUser(), auth.getToken(), true)
    }, this.props.dispatch);
  }

  renderBackButton() {
    return (this.props.pluralName === "" || this.props.adminPageType === 'index') ? null 
      : <BackButton 
          label={this.props.pluralName} 
          link={'/admin/' + this.props.pluralName}
        />
  }

  render() {
    let iconElementRight = null;
    
    if(this.props.loggedIn) {
      iconElementRight = (
        <IconMenu
          style={{marginTop: -4}}
          iconButtonElement={<IconButton
            style={{width: 56, height: 56}}><MoreVertIcon /></IconButton>}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          anchorOrigin={{horizontal: 'middle', vertical: 'bottom'}}
        >
          <MenuItem primaryText="Settings" containerElement={<Link to="/admin/settings"/>} />
          <MenuItem primaryText="Log Out" onTouchTap={(event) => this.handleLogout(event)} />
        </IconMenu>
      );
    }

    return (
      <div>
        <Drawer
          open={this.state.menuOpen}
          docked={false}
          onRequestChange={() => this.toggleMenu()}
        >
          <AdminMenu currentUser={this.props.user} routeOptions={AppConfig.routes.admin} />
        </Drawer>
        <header>
          <AppBar
            title={(
              <div className="title-wrapper">
                <h1 className="admin-title">{AppConfig.cmsTitle ? AppConfig.cmsTitle : 'React CMS'}</h1>
                {this.renderBackButton()}
              </div>
            )}
            onLeftIconButtonTouchTap={() => this.toggleMenu()}
            style={{ position: 'fixed' }}
            iconElementRight={iconElementRight}
          />
        </header>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.auth.logged_in,
    user: state.auth.user,
    token: state.auth.token,
    location: state.routing.locationBeforeTransitions,
    pluralName: state.admin.resource.name.plural,
    adminPageType: state.admin.pageType,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logoutUser: (redirectPath) => {
      dispatch({
        type: 'USER_LOGGED_OUT',
        redirectPath,
      });
    },
    loginUser: (user, token, loggedIn, redirectPath) => {
      dispatch({
        type: 'USER_LOGGED_IN',
        user,
        token,
        loggedIn,
        redirectPath,
      });
    },
    dispatch,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AdminNav);
