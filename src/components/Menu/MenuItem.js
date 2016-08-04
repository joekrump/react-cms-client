import React from 'react';
import merge from 'lodash/merge';

import MUIMenuItem from 'material-ui/MenuItem';

const styles = {
  cursor: 'pointer'
}
const MenuItem = (props) => (
  <MUIMenuItem style={merge(props.style, styles)} {...props} />
)

export default MenuItem;