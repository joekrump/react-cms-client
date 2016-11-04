import React from 'react';
import s from './FlexContainer.scss'
import withStyles from 'isomorphic-style-loader/lib/withStyles';

const FlexContainer = (props) => (
  <div className="flex-container">
    {props.children}
  </div>
);

export default withStyles(s)(FlexContainer);