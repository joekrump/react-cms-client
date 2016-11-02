import React from 'react';
import {connect} from 'react-redux';
import { indigoA400 } from 'material-ui/styles/colors';

const style = {
  highlight: {
    color: indigoA400
  }
}

const PermissionsInstructions = (props) => (
  <p className="instructions">
    <span>Select the Permissions that should be associated with the </span>
    <strong style={style.highlight}>{props.roleName}</strong><span> Role.</span>
  </p>
)

const mapStateToProps = (state) => ({
  roleName: state.forms.roleForm.fields.display_name.value
});

export default connect(mapStateToProps)(PermissionsInstructions);