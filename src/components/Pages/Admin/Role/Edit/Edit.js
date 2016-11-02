import React from 'react'
import ResourceForm from '../../../../Forms/ResourceForm';
import { connect } from 'react-redux'
import AdminLayout from '../../Layout/AdminLayout'
import {Tabs, Tab} from 'material-ui/Tabs';
import PermissionsList from './PermissionsList';
import PermissionsInstructions from './PermissionsInstructions';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  }
};

class Edit extends React.Component {
  
  constructor(props, context) {
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
          <Tab label="Role Details" value="role">
            <div className="tab-content">
              <h2 style={styles.headline}>Role Details</h2>
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
            <div className="tab-content">
              <h2 style={styles.headline}>Permissions</h2>
              <PermissionsInstructions />
              <PermissionsList roleId={this.state.editContext === 'edit' ? this.props.params.roleId : undefined} />
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

const mapStateToProps = (state) => ({
  currentUser: state.auth.user
})

export default connect(
  mapStateToProps
)(Edit);