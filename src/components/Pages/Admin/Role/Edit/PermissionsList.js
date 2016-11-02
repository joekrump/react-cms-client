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
      permissions: []
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
  }

  render() {
    let permissionToggleSwitches = this.state.permissions.map((permission) => (
      <Toggle
        key={permission.id}
        label={<span><strong>{permission.display_name}</strong>: <em>{permission.description}</em></span>}
        style={styles.switch}
      />
    ))
    return (
      <div>
        {permissionToggleSwitches}
      </div>
    )
  }
  
}

export default connect()(PermissionsList);