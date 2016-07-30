import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import { cyan500 } from 'material-ui/styles/colors';
import { Link } from 'react-router'

const LeftNavMenuItem = (props) => {
  return (
    <MenuItem className={"drawer-link"} containerElement={<Link to={props.url} />} 
        primaryText={props.linkText} style={props.isActive ?  { color: cyan500 } : null } />
  )
};

export default LeftNavMenuItem;
