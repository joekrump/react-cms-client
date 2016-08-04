import React from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from './Menu/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Divider from 'material-ui/Divider';
import AppConfig from '../../app_config/app';
import { cyan500 } from 'material-ui/styles/colors';

import LeftNavMenuItem from './Nav/LeftNavMenuItem';
import Gravatar from './Nav/Gravatar';

import auth from '../auth';

import { connect } from 'react-redux';
import { push } from 'react-router-redux'

import ListItem from 'material-ui/List/ListItem';

const App = React.createClass({
  contextTypes: {
      router: React.PropTypes.object
  },
  getInitialState(){
    return  {
      menu: {
        isOpen: false
      },
      loggedIn: auth.loggedIn(),
      user: auth.getUser()
    };
  },
  updateAuth(loggedIn) {
    this.setState({
      loggedIn: loggedIn,
      user: auth.getUser()
    })
  },
  handleToggleMenu() {
    let previousState = this.state;
    previousState.menu.isOpen = !previousState.menu.isOpen;
    this.setState(previousState);
  },
  closeMenu() {
    this.setState({menu: {isOpen: false}});
  },
  componentDidMount() {
    // Do something when the app first mounts
  },
  componentWillMount() {
    auth.onChange = this.updateAuth
    if(sessionStorage.laravelAccessToken){
      auth.login()
    }
    
  },
  componentWillReceiveProps(nextProps){

    if(nextProps.location.pathname !== this.props.location.pathname){
      this.closeMenu(); 
    }
  },
  pageIsActive(url, indexOnly = false){
    return this.context.router.isActive({pathname: url}, indexOnly)
  },
  getLeftMenuItems() {
    let staticNavLinks = [];
    let menuItems = [];

    if(this.state.loggedIn){
      if(this.state.user) {
        menuItems = [
          (<ListItem
            key="user-avatar"
            disabled={true}
            leftAvatar={
              <Gravatar style={{position: 'absolute', top: '8px', left: '18px'}} email={this.state.user.email} diameter='50' />
            }
            primaryText={this.state.user.name}
            style={{color: 'white', backgroundColor: cyan500}}
          />)
        ]
      }
      menuItems.push((<Divider key="avatar-divider" />));
    }

    if (this.state.loggedIn){
      staticNavLinks = AppConfig.adminRouteLinks
    } else {
      staticNavLinks = AppConfig.publicRouteLinks
    }

    staticNavLinks.forEach((routeSettings, i) => {
      menuItems.push(<LeftNavMenuItem key={'left-nav-link-' + i} linkText={routeSettings.linkText} url={routeSettings.url} isActive={this.pageIsActive(routeSettings.url, true)}/>)
      return 1;
    })
    return menuItems
  },
  handleLogout(e){
    e.preventDefault();
    auth.logout(() => {
      this.props.dispatch(push('/login'))
    });
  },
  render() {
    
    var iconElementRight = null;
    if(this.state.loggedIn) {
      iconElementRight = (
        <IconMenu
          iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
        >
          <MenuItem primaryText="Log Out" onTouchTap={(event) => this.handleLogout(event, this)} />
        </IconMenu>
      )
    }

    return (
      <div>
        <Drawer 
          open={this.state.menu.isOpen}
          docked={false} 
          onRequestChange={this.handleToggleMenu}
        >
          {this.getLeftMenuItems()}
        </Drawer>
        <header>
          {/*TODO: put site title in a NODE config file of some-sort. */}
          <AppBar 
            title='React CMS' 
            onLeftIconButtonTouchTap={this.handleToggleMenu} 
            style={{position: 'fixed'}}
            iconElementRight={iconElementRight}
          />
        </header>
        <div className="page-container">
          {this.props.children}
        </div>
      </div>
    )
  }
})

export default connect()(App);