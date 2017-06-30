// src/components/Menu/LeftMenuItem.js
import React from "react";
import MenuItem from "material-ui/MenuItem";
import { Link } from "react-router";

const LeftNavMenuItem = (props, context) => (
  <MenuItem 
    className={"drawer-link"} 
    containerElement={<Link to={props.url} />} 
    primaryText={props.linkText}
    style={props.isActive ?  { backgroundColor: "rgba(255,255,255,0.1" } : null }
  />
);

LeftNavMenuItem.contextTypes = {
  muiTheme: React.PropTypes.object.isRequired
};

export default LeftNavMenuItem;
