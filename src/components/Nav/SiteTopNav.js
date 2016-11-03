import React from 'react';
import AppConfig from '../../../app_config/app'
import { Link } from 'react-router';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SiteTopNav.scss'

let links = AppConfig.publicRouteLinks.map((link, i) => (
  <Link 
    className="top-link"
    key={'top-link-' + i} 
    activeClassName="link-active"
    to={link.url}>
    {link.linkText}
  </Link>
)

const TopNav = () => (
  <div className="top-nav">
    <div className="page-container">
      {AppConfig.siteTitle ? (<h1 className="site-title">{AppConfig.siteTitle}</h1>) : null}
      <div className="nav-links-container">
        {links}
      </div>
    </div>
  </div>
)

export default withStyles(s)(TopNav);