import React from 'react'
import SpeedDial from '../../../Menu/SpeedDial'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EditPageLayout.scss'
import TopNav from '../../../Nav/SiteTopNav'
const EditPageLayout = (props) => (
  <div className="edit-page-container">
    <TopNav />
    {props.children}
    <SpeedDial />
  </div>
);

export default withStyles(s)(EditPageLayout);