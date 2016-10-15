import React from 'react';
import { Link } from 'react-router';
import Divider from 'material-ui/Divider';
import LeftNavMenuItem from './LeftNavMenuItem';
import Gravatar from './Gravatar';
import ListItem from 'material-ui/List/ListItem';

function pageIsActive(router, url, indexOnly = false) {
  return router.isActive({pathname: url}, indexOnly)
}

const AdminMenu = (props, context) => {

  let menuItems = [
    (<ListItem
      key="user-avatar"
      disabled={true}
      leftAvatar={
        <Gravatar style={{position: 'absolute', top: '8px', left: '18px'}} email={props.currentUser.email} diameter='50' />
      }
      primaryText={<Link to="/admin/settings">{props.currentUser.name}</Link>}
      style={{color: 'white', backgroundColor: context.muiTheme.palette.primary1Color}}
    />)
  ];

  menuItems.push((<Divider key="avatar-divider" />));
  menuItems.push((<LeftNavMenuItem 
      key={'left-nav-link-dashboard'} 
      linkText={props.routesOptions.dashboard.linkText} 
      url={props.routesOptions.dashboard.url} 
      isActive={pageIsActive(context.router, props.routesOptions.dashboard.url, true)}/>));

  props.currentUser.menuList.forEach((menuItem, i) => {
    menuItems.push(<LeftNavMenuItem 
      key={'left-nav-link-' + i} 
      linkText={props.routesOptions[menuItem].linkText} 
      url={props.routesOptions[menuItem].url} 
      isActive={pageIsActive(context.router, props.routesOptions[menuItem].url, true)}/>)
    return 1;
  })
  
  return (
    <div className="admin-menu">
      {menuItems}
    </div>
  );
}

AdminMenu.contextTypes = {
  router: React.PropTypes.object.isRequired,
  muiTheme: React.PropTypes.object.isRequired,
}

export default AdminMenu;