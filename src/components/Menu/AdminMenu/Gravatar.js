import React from "react";
import Avatar from "material-ui/Avatar";

import gravatar from "gravatar";

const Gravatar = props => (
  <Avatar
    style={props.style}
    src={gravatar.url(props.email, {s: props.diameter, r: "x", d: "retro"}, true)} 
  />
);

export default Gravatar;
