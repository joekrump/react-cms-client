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
      role: null
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
    
    client.post('attach-permissions', true, {data: {permissionIds: this.getToggledPermissions(), role_id: this.state.role.id}}).then((res) => {
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
  }

  componentDidMount() {
    const client = new APIClient(this.props.dispatch);
    var role = null;

    if(this.props.roleId) {
      client.get(`roles/${this.props.roleId}`).then((res) => {
        if (res.statusCode !== 200) {
          console.log('Bad response: ', res);
        } else {
          client.updateToken(res.header.authorization);
          role = res.body.data;
          this.setState({role});
          this.getPermissions(role);
        }
      }, (res) => {
        console.warn('Error getting resource data: ', res);
      })
      .catch((res) => {
        console.warn('Error getting resource data: ', res);
      })
    } else {
      this.getPermissions(role);
    }
  }

  getPermissions(role) {
    const client = new APIClient(this.props.dispatch);

    client.get('permissions').then((res) => {
      if (res.statusCode !== 200) {
        console.log('Bad response: ', res);
      } else {
        client.updateToken(res.header.authorization);
        this.setPermissions(res.body.data, role);
      }
    }, (res) => {
      console.warn('Error getting resource data: ', res);
    })
    .catch((res) => {
      console.warn('Error getting resource data: ', res);
    })
  }

  setPermissions(permissions, role) {
    var modifiedPermissions = []
    
    let permissionToggleSwitches = permissions.forEach((permission, i) => {
      permission.toggled = this.isPermissionToggled(permission, role);
      modifiedPermissions.push(permission);
    });

    this.setState({permissions: modifiedPermissions});
  }

  isPermissionToggled(permission, role) {
    if(permission.toggled) {
      return permission.toggled;
    }
    return (role !== null) && (role.permissions.indexOf(permission.name) !== -1);
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