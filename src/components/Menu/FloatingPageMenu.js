import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './FloatingPageMenu.scss'

const FloatingPageMenu = (props) => (
  <div className="page-menu floating-menu">
    {props.children}
  </div>
)

export default withStyles(s)(FloatingPageMenu);