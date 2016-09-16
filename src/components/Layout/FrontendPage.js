import React from 'react';
import s from './FrontendPage.scss'
import withStyles from 'isomorphic-style-loader/lib/withStyles';

const FrontendPage = (props) => (
  <div className="frontend-page-container">
    {props.children}
  </div>
) 

export default withStyles(s)(FrontendPage);