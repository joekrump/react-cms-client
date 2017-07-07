import React from "react";
import { ListItem } from "material-ui/List";

const DisabledListItem = (props) => (
  <ListItem
    disabled={true}
    disableKeyboardFocus={true}
    {...props}
  >
    {props.children}
  </ListItem>
);

export default DisabledListItem;