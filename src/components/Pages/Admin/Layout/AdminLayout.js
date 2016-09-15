import React from 'react'
import SpeedDial from '../../../Menu/SpeedDial'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './AdminLayout.scss'

const AdminLayout = (props) => (
  <div className="admin-container">
    {props.children}
    <SpeedDial />
  </div>
);

export default withStyles(s)(AdminLayout);