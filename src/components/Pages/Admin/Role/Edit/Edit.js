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

    let editContext = props.params && props.params.resourceId ? 'edit' : 'new';
    let resourceId = editContext === 'edit' ? props.params.resourceId : undefined;

    this.state = {
      currentTab: 'role',
      submitPermissions: false,
      editContext
    };

    props.updateAdminState('roles', editContext, resourceId);
  }

  handleTabChange = (value) => {
    this.setState({
      currentTab: value,
    });
  };

  updateSubmitPermissions() {
    this.stateState({submitPermissions: false})
  }

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
                resourceURL={this.state.editContext === 'edit' ? `roles/${this.props.params.resourceId}` : 'roles'}
                resourceId={this.state.editContext === 'edit' ? this.props.params.resourceId : undefined}
                resourceType='role'
                editContext={this.state.editContext}
                successCallback={() => {
                  this.setState({submitPermissions: true});
                }}
              />
            </div>
          </Tab>
          <Tab label="Permissions" value="permissions">
            <div className="tab-content">
              <h2 style={styles.headline}>Permissions</h2>
              <PermissionsInstructions />
              <PermissionsList resourceId={this.state.editContext === 'edit' ? this.props.params.resourceId : undefined} 
                submitPermissions={this.state.submitPermissions}
                updatePermissionsCallback={this.updateSubmitPermissions}
              />
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
            resourceURL={this.state.editContext === 'edit' ? `roles/${this.props.params.resourceId}` : 'roles'}
            resourceId={this.state.editContext === 'edit' ? this.props.params.resourceId : undefined}
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

const mapDispatchToProps = (dispatch) => {
  return {
    updateAdminState: (namePlural, pageType, resourceId) => {
      dispatch({
        type: 'UPDATE_ADMIN_STATE',
        namePlural,
        pageType,
        resourceId
      })
    },
    dispatch
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Edit);