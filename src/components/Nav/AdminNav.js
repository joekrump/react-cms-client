import React from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from '../Menu/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Divider from 'material-ui/Divider';
import AppConfig from '../../../app_config/app';
import { Link } from 'react-router';
import LeftNavMenuItem from './LeftNavMenuItem';
import Gravatar from './Gravatar';
import auth from '../../auth';
import { connect } from 'react-redux';
import ListItem from 'material-ui/List/ListItem';

class AdminNav extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      menuOpen: false
    }
  }

  componentWillReceiveProps(nextProps){
    // if(nextProps.location.pathname !== this.props.location.pathname){
    //   this.closeMenu(); 
    // }
  }

  handleToggleMenu() {
    this.setState({
      menuOpen: !this.state.menuOpen
    });
  }

  closeMenu() {
    this.setState({menuOpen: false});
  }

  pageIsActive(url, indexOnly = false){
    return this.context.router.isActive({pathname: url}, indexOnly)
  }

  getLeftMenuItems() {
    let menuItems = [
      (<ListItem
        key="user-avatar"
        disabled={true}
        leftAvatar={
          <Gravatar style={{position: 'absolute', top: '8px', left: '18px'}} email={this.props.user.email} diameter='50' />
        }
        primaryText={<Link to="/admin/settings">{this.props.user.name}</Link>}
        style={{color: 'white', backgroundColor: this.context.muiTheme.palette.primary1Color}}
      />)
    ];

    menuItems.push((<Divider key="avatar-divider" />));

    AppConfig.adminRouteLinks.forEach((routeSettings, i) => {
      menuItems.push(<LeftNavMenuItem 
        key={'left-nav-link-' + i} 
        linkText={routeSettings.linkText} 
        url={routeSettings.url} 
        isActive={this.pageIsActive(routeSettings.url, true)}/>)
      return 1;
    })
    return menuItems
  }

  handleLogout(e){
    e.preventDefault();
    console.log('logout');
    auth.logout(() => {
      // dispatch an action if the server has successfully logged out the user.
      this.props.logoutUser('/login');
    }, this.context.store);
  }

  render() {

    var iconElementRight = null;
    if(this.props.loggedIn) {
      iconElementRight = (
        <IconMenu
          iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
        >
          <MenuItem primaryText="Settings" containerElement={<Link to="/admin/settings"/>} />
          <MenuItem primaryText="Log Out" onTouchTap={(event) => this.handleLogout(event)} />
        </IconMenu>
      )
    }

    return (
      <div>
        <Drawer 
          open={this.state.menuOpen}
          docked={false} 
          onRequestChange={() => this.handleToggleMenu()}
        >
          {this.getLeftMenuItems()}
        </Drawer>
        <header>
          {/*TODO: put site title in a NODE config file of some-sort. */}
          <AppBar 
            title='React CMS' 
            onLeftIconButtonTouchTap={() => this.handleToggleMenu()} 
            style={{position: 'fixed'}}
            iconElementRight={iconElementRight}
          />
        </header>
      </div>
    )
  }
}



AdminNav.contextTypes = {
  router: React.PropTypes.object.isRequired,
  muiTheme: React.PropTypes.object.isRequired,
  store: React.PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.auth.logged_in,
    user: state.auth.user,
    token: state.auth.token,
    location: state.routing.locationBeforeTransitions
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logoutUser: (redirectPath) => {
      dispatch ({
        type: 'USER_LOGGED_OUT',
        redirectPath
      })
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminNav);