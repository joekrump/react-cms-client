import React from 'react'
import SpeedDial from '../../../Menu/SpeedDial'

const AdminLayout = (props) => (
  <div className="admin-container">
    {props.children}
    <SpeedDial />
  </div>
);

export default AdminLayout;