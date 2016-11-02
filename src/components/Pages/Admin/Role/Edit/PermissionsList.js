import React from 'react';
import Toggle from 'material-ui/Toggle';
import APIClient from '../../../../../http/requests'
import { connect } from 'react-redux';


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
  componentDidMount() {
    const client = new APIClient(this.props.dispatch);

    client.get('permissions').then((res) => {
      if (res.statusCode !== 200) {
        console.log('Bad response: ', res);
      } else {
        client.updateToken(res.header.authorization);
        this.setState({permissions: res.body.data});
      }
    }, (res) => {
      console.warn('Error getting resource data: ', res);
    })
    .catch((res) => {
      console.warn('Error getting resource data: ', res);
    })
    if(this.props.roleId) {
      client.get(`roles/${this.props.roleId}`).then((res) => {
        if (res.statusCode !== 200) {
          console.log('Bad response: ', res);
        } else {
          client.updateToken(res.header.authorization);
          this.setState({role: res.body.data});
        }
      }, (res) => {
        console.warn('Error getting resource data: ', res);
      })
      .catch((res) => {
        console.warn('Error getting resource data: ', res);
      })
    }
  }

  render() {
    console.log(this.state.role);
    let permissionToggleSwitches = this.state.permissions.map((permission) => (
      <Toggle
        key={permission.id}
        labelPosition="right"
        label={<span><strong>{permission.display_name}</strong>: <em>{permission.description}</em></span>}
        style={styles.switch}
        defaultToggled={(this.state.role !== null) && (this.state.role.permissions)}
      />
    ))
    return (
      <p>
        {permissionToggleSwitches}
      </p>
    )
  }
}

export default connect()(PermissionsList);