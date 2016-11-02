import React from 'react'
import ResourceForm from '../../../../Forms/ResourceForm';
import { connect } from 'react-redux'
import AdminLayout from '../../Layout/AdminLayout'
import {Tabs, Tab} from 'material-ui/Tabs';
import PermissionsList from './PermissionsList';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
};

class Edit extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 'role',
      editContext: props.params && props.params.roleId ? 'edit' : 'new'
    };
  }

  handleTabChange = (value) => {
    this.setState({
      currentTab: value,
    });
  };

  renderInterface() {
    if(this.props.currentUser.isAdmin) {
      return (
        <Tabs
          value={this.state.value}
          onChange={this.handleChange}
        >
          <Tab label="Role Details" value="role" >
            <div>
              <h2 style={styles.headline}>User Details</h2>
              <ResourceForm 
                formName='roleForm'
                resourceURL={this.state.editContext === 'edit' ? `roles/${this.props.params.roleId}` : 'roles'}
                resourceId={this.state.editContext === 'edit' ? this.props.params.roleId : undefined}
                resourceType='role'
                editContext={this.state.editContext}
              />
            </div>
          </Tab>
          <Tab label="Permissions" value="permissions">
            <div>
              <h2 style={styles.headline}>Permissions</h2>
              <p>
                Select the Permissions that should be associated with this Role.
              </p>
              <PermissionsList />
            </div>
          </Tab>
        </Tabs>
      )
    } else {
      return (
        <div>
          <h2 style={styles.headline}>Role Details</h2>
          <ResourceForm 
            formName='roleForm'
            resourceURL={this.state.editContext === 'edit' ? `roles/${this.props.params.roleId}` : 'roles'}
            resourceId={this.state.editContext === 'edit' ? this.props.params.roleId : undefined}
            resourceType='role'
            editContext={this.state.editContext}
          />
        </div>
      )
    }
  }

  render() {
    if(!this.props.currentUser) {
      return null;
    } else {
      return (
        <AdminLayout>
          {this.renderInterface()}
        </AdminLayout>
      )
    }   
  }
};

const mapStateToProps = (state) => {
  return {currentUser: state.auth.user}
}

export default connect(
  mapStateToProps
)(Edit);