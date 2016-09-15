import React from 'react'
import SpeedDial from '../../../Menu/SpeedDial'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EditPageLayout.scss'

const EditPageLayout = (props) => (
  <div className="edit-page-container">
    {props.children}
    <SpeedDial />
  </div>
);

export default withStyles(s)(EditPageLayout);