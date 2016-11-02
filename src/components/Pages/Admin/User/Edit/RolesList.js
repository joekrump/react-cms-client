import React from 'react';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import APIClient from '../../../../../http/requests'
import { connect } from 'react-redux';


const styles = {
  radioButton: {
    marginBottom: 16,
  }
};

class RolesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roles: [],
      selectedRoleId: null
    }
  }

  componentWillReceiveProps(nextProps) {
    if(!this.props.updateRole && nextProps.updateRole) {
      this.assignRole();
    }
  }

  assignRole() {
    const client = new APIClient(this.props.dispatch);

    client.post('assign-role', true, {data: {user_id: this.props.userId, role_id: this.state.selectedRoleId }})
    .then((res) => {
      if (res.statusCode >= 300) {
        console.log('Bad response: ', res);
      } else {
        client.updateToken(res.header.authorization);
        this.props.assignRoleCallback(false);
      }
    }, (res) => {
      console.warn('Error getting resource data: ', res);
    })
    .catch((res) => {
      console.warn('Error getting resource data: ', res);
    })
  }

  componentDidMount() {
    const client = new APIClient(this.props.dispatch);

    client.get('roles').then((res) => {
      if (res.statusCode >= 300) {
        console.log('Bad response: ', res);
      } else {
        client.updateToken(res.header.authorization);
        this.setState({roles: res.body.data});
      }
    }, (res) => {
      console.warn('Error getting resource data: ', res);
    })
    .catch((res) => {
      console.warn('Error getting resource data: ', res);
    })
  }

  handleRoleChange(evt, selectedRoleId) {
    this.setState({selectedRoleId: value})
  }

  render() {
    let roleRadioButtons = this.state.roles.map((role) => (
      <RadioButton
        key={role.id}
        value={role.id}
        label={<span><strong>{role.display_name}</strong>: <em>{role.description}</em></span>}
        style={styles.radioButton}
      />
    ))
    return (
      <p>
        <RadioButtonGroup name="role" onChange={this.handleRoleChange}>
          {roleRadioButtons}
        </RadioButtonGroup>
      </p>
    )
  }
  
}

export default connect()(RolesList);