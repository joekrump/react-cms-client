import React from 'react';
import AppConfig from '../../../app_config/app'
import { Link } from 'react-router';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SiteTopNav.scss'

let links = AppConfig.publicRouteLinks.map((link, i) => {
  return (
    <Link 
      className="top-link align-left"
      key={'top-link-' + i} 
      activeClassName="link-active"
      to={link.url}>
      {link.linkText}
    </Link>
  )
})

const TopNav = () => {
  return (
    <div className="top-nav">
      <div className="page-container">
        {links}
      </div>
    </div>
  )
}

export default withStyles(s)(TopNav);