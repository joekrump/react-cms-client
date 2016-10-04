import React from 'react'
import SpeedDial from '../../../Menu/SpeedDial'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EditCardLayout.scss'

const EditCardLayout = (props) => (
  <div className="edit-card-container">
    {props.children}
    <SpeedDial />
  </div>
);

export default withStyles(s)(EditCardLayout);