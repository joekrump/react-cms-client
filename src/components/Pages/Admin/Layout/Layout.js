import React from 'react'
import SpeedDial from '../../../Menu/SpeedDial'

const Layout = (props) => (
  <div className="admin-container">
    {props.children}
    <SpeedDial />
  </div>
);

export default Layout;