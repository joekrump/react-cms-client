import React from 'react';
import Toggle from 'material-ui/Toggle';
import APIClient from '../../../../../http/requests'
import { connect } from 'react-redux';
import findIndex from 'lodash.findindex';

const styles = {
  switch: {
    marginBottom: 16,
  }
};

class PermissionsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      permissions: [],
    }
  }

  getToggledPermissions() {
    let toggledIds = []
    this.state.permissions.forEach((permission) => {
      if(permission.toggled) {
        toggledIds.push(permission.id);
      }
    })
    return toggledIds;
  }

  updatePermissions() {
    const client = new APIClient(this.props.dispatch);
    
    client.post('attach-permissions', true, {data: {permissionIds: this.getToggledPermissions(), role_id: this.props.roleId}}).then((res) => {
      if (res.statusCode !== 200) {
        console.log('Bad response: ', res);
      } else {
        client.updateToken(res.header.authorization);
        this.props.updatePermissionsCallback();
      }
    }, (res) => {
      console.warn('Error updating Permissions: ', res);
    })
    .catch((res) => {
      console.warn('Error updating Permissions: ', res);
    })
  }

  componentWillReceiveProps(nextProps) {
    if(!this.props.submitPermissions && nextProps.submitPermissions) {
      this.updatePermissions();
    }
    if(nextProps.roleId !== this.props.roleId) {
      if(this.state.permissions.length === 0) {
        this.getPermissions(nextProps.rolePermissions);
      } else {
        this.setPermissions(this.state.permissions, nextProps.rolePermissions);
      }
    }
  }

  getPermissions(rolePermissions) {
    const client = new APIClient(this.props.dispatch);

    client.get('permissions').then((res) => {
      if (res.statusCode !== 200) {
        console.log('Bad response: ', res);
      } else {
        client.updateToken(res.header.authorization);
        this.setPermissions(res.body.data, rolePermissions);
      }
    }, (res) => {
      console.warn('Error getting resource data: ', res);
    })
    .catch((res) => {
      console.warn('Error getting resource data: ', res);
    })
  }

  setPermissions(permissions, rolePermissions) {
    var modifiedPermissions = []
    
    permissions.forEach((permission, i) => {
      permission.toggled = this.isPermissionToggled(permission, rolePermissions);
      modifiedPermissions.push(permission);
    });

    this.setState({permissions: modifiedPermissions});
  }

  isPermissionToggled(permission, rolePermissions) {
    if(permission.toggled) {
      return permission.toggled;
    }
    return rolePermissions.indexOf(permission.name) !== -1;
  }

  togglePermission(evt, permissionId) {
    let permissionIndex = findIndex(this.state.permissions, (permission) => {
      return permission.id === permissionId
    });

    let currentPermissions = this.state.permissions;
    currentPermissions[permissionIndex].toggled = !currentPermissions[permissionIndex].toggled;
    this.setState({permissions: currentPermissions});
  }

  renderSwitches() {
    return this.state.permissions.map((permission, i) => (
      <Toggle
        key={permission.id}
        labelPosition="right"
        label={`${permission.display_name}: ${permission.description}`}
        style={styles.switch}
        toggled={permission.toggled}
        onToggle={(evt) => this.togglePermission(evt, permission.id)}
      />
    ));
  }

  render() {
    return (
      <div className="tab-indented">
        {this.renderSwitches()}
      </div>
    )
  }
}

export default connect()(PermissionsList);