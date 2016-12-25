import React from 'react'
import SpeedDial from '../../../Menu/SpeedDial'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './AdminLayout.scss'
import Helmet from 'react-helmet'
import AppConfig from '../../../../../app_config/app';

const AdminLayout = (props) => (
  <div className="admin-container">
    <Helmet 
      title={`${AppConfig.siteTitle} | Admin`}
    />
    {props.children}
    <SpeedDial />
  </div>
);

export default withStyles(s)(AdminLayout);