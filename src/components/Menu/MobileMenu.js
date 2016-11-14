import React from 'react';
import { Link } from 'react-router';
import Divider from 'material-ui/Divider';
import LeftNavMenuItem from './LeftNavMenuItem';
import ListItem from 'material-ui/List/ListItem';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import AppConfig from '../../../app_config/app'
import s from './MobileMenu.scss';

function pageIsActive(router, url, indexOnly = false) {
  return router.isActive({pathname: url}, indexOnly)
}

const MobileMenu = (props, context) => {

  let menuItems = [
    (<ListItem
      className="drawer-header"
      key="user-avatar"
      disabled={true}
      leftAvatar={
        <span style={{top: '12px'}} className="logo light"></span>
      }
      primaryText={<Link to="/" className="link dark header-text">{AppConfig.siteTitle}</Link>}
    />)
  ];

  menuItems.push((<Divider key="avatar-divider" />));

  AppConfig.routes.public.forEach((link, i) => {
    menuItems.push(<LeftNavMenuItem 
      key={'left-nav-link-' + i} 
      linkText={link.routeTitle} 
      url={link.url} 
      isActive={pageIsActive(context.router, link.url, true)}/>)
    return 1;
  });

  return (
    <div className="mobile-menu">
      {menuItems}
    </div>
  );
}

MobileMenu.contextTypes = {
  router: React.PropTypes.object.isRequired,
  muiTheme: React.PropTypes.object.isRequired,
}

export default withStyles(s)(MobileMenu);