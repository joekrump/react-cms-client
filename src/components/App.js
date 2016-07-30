import React from 'react';
import { Link} from 'react-router'
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Divider from 'material-ui/Divider';

import {cyan500} from 'material-ui/styles/colors';
import auth from '../auth';
import gravatar from 'gravatar';

import ListItem from 'material-ui/List/ListItem';
import Avatar from 'material-ui/Avatar';

const App = React.createClass({
  contextTypes: {
      router: React.PropTypes.object
  },
  // propTypes: {
  //   data: React.PropTypes.string.isRequired,
  //   fromAdmin: React.PropTypes.boolean,
  //   verbose: React.PropTypes.boolean
  // },
  getInitialState(){
    return  {
      menu: {
        isOpen: false
      },
      jobs: [] ,
      loggedIn: auth.loggedIn(),
      user: auth.getUser(),
      currentPagePath: '/'
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
    
    this.setState({
      currentPagePath: this.props.location.pathname
    })
  },
  componentWillReceiveProps(nextProps){
    if(nextProps.location !== this.props.location){
      this.closeMenu(); 
    }
  },
  pageIsActive(url, indexOnly = false){
    return this.context.router.isActive({pathname: url}, indexOnly)
  },
  setCurrentPagePath(){
    this.setState({currentPagePath: this.props.location.pathname});
  },
  didNavigate(){
    return this.state.currentPagePath !== this.props.location.pathname
  },
  render() {
    // Set which items should display in the menu based on whether the user is logged in or not
    let menuItems = this.state.loggedIn ? (
      [     
        this.state.user ?
        (
          <ListItem
            disabled={true}
            leftAvatar={
              <Avatar src={gravatar.url(this.state.user.email, {s: '50', r: 'x', d: 'retro'}, true)} />
            }
          >
            {this.state.user.name}
          </ListItem>
        ) :
        null
        ,
        <Divider />,
        <MenuItem className="drawer-link" key="dashboard" containerElement={<Link to="/admin" />} 
          primaryText="Dashboard" style={this.pageIsActive('/admin', true) ?  {color: cyan500} : null } />,
        <MenuItem className="drawer-link" key="users" containerElement={<Link to="/admin/users" />} 
          primaryText="Users" style={this.pageIsActive('/admin/users', true) ?  {color: cyan500} : null } />,  
        <MenuItem className="drawer-link" key="userprofile" containerElement={<Link to={'/admin/users/' + this.state.user.id} />} 
          primaryText="User Profile" style={this.pageIsActive('/admin/users/' + this.state.user.id, true) ?  {color: cyan500} : null } />,  
        <MenuItem className="drawer-link" key="useredit" containerElement={<Link to={'/admin/users/' + this.state.user.id + '/edit'} />} 
          primaryText="User Edit" style={this.pageIsActive('/admin/users/' + this.state.user.id + '/edit') ?  {color: cyan500} : null } />        
      ]
    ) :
    (
      [
        <MenuItem className="drawer-link" key="home" containerElement={<Link to="/" />} 
          primaryText="Home" style={this.pageIsActive('/', true) ?  {color: cyan500} : null } />,
        <MenuItem className="drawer-link" key="inbox" containerElement={<Link to="/inbox" />} 
          primaryText="Inbox" style={this.pageIsActive('/inbox') ?  {color: cyan500} : null }/>,
        <MenuItem className="drawer-link" key="about" containerElement={<Link to="/about" />}
         primaryText="About" style={this.pageIsActive('/about') ?  {color: cyan500} : null }/>,
        <MenuItem className="drawer-link" key="donate" containerElement={<Link to="/donate" />}
         primaryText="Make a payment" style={this.pageIsActive('/donate') ?  {color: cyan500} : null }/>,
        <MenuItem className="drawer-link" key="login" containerElement={<Link to="/login" />}
         primaryText="Log In" style={this.pageIsActive('/login') ?  {color: cyan500} : null }/>,
        <MenuItem className="drawer-link" key="redux-counter" containerElement={<Link to="/redux-counter" />}
         primaryText="Redux Counter" style={this.pageIsActive('/redux-counter') ?  {color: cyan500} : null }/>
      ]
    );

    return (
      <div>
        <Drawer 
          open={this.state.menu.isOpen}
          docked={false} 
          onRequestChange={this.handleToggleMenu}
        >
          {menuItems}
        </Drawer>
        <header>
          {/*TODO: put site title in a NODE config file of some-sort. */}
          <AppBar 
            title='JWT CMS' 
            onLeftIconButtonTouchTap={this.handleToggleMenu} 
            style={{position: 'fixed'}}
            iconElementRight={this.state.loggedIn ?
              (                  
                <IconMenu
                  iconButtonElement={
                    <IconButton><MoreVertIcon /></IconButton>
                  }
                  targetOrigin={{horizontal: 'right', vertical: 'top'}}
                  anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                >
                  <MenuItem className="drawer-link" key="logout" containerElement={<Link to="/logout" />} 
                    primaryText="Log Out" onTouchTap={this.handleNavLinkTouchTap}/>
                </IconMenu>
              ) : null
            }
          />
        </header>
        <div className="page-container">
          {this.props.children}
        </div>
      </div>
    )
  }
})


export default App;