import React from 'react';
import { Link } from 'react-router';
import s from './Breadcrumb.scss'
import withStyles from 'isomorphic-style-loader/lib/withStyles';

const Breadcrumb = (props) => (
  <span className="breadcrumb-link-container">
    <Link className="breadcrumb-link" to={props.url}>{props.name}</Link>
    <span className="breadcrumb-divider">/</span>
  </span>
);

export default withStyles(s)(Breadcrumb);
