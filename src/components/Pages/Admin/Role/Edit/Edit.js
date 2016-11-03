import React from 'react'
import ResourceForm from '../../../../Forms/ResourceForm';
import { connect } from 'react-redux'
import AdminLayout from '../../Layout/AdminLayout'
import {Tabs, Tab} from 'material-ui/Tabs';
import PermissionsList from './PermissionsList';
import PermissionsInstructions from './PermissionsInstructions';
import { capitalize } from '../../../../../helpers/StringHelper';
import { getResourceData } from '../../../../../helpers/ResourceHelper';

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

    const editContext = props.params && props.params.resourceId ? 'edit' : 'new';
    const resourceId = editContext === 'edit' ? parseInt(props.params.resourceId, 10) : undefined;
    const resourceURL = editContext === 'edit' ? `roles/${resourceId}` : 'roles';

    this.state = {
      currentTab: 'role',
      submitPermissions: false,
      editContext,
      resourceId,
      resourceURL,
      roleId: null, 
      rolePermissions: []
    };

    props.updateAdminState('roles', editContext, resourceId);

    if(resourceId) {
      getResourceData(props.dispatch, resourceURL, this.fetchDataResolve, this.handleRequestException);
    }
  }

  fetchDataResolve = (res) => {
    if (res.statusCode < 300) {
      this.setState({rolePermissions: res.body.data.permissions, roleId: res.body.data.id});
      this.props.loadFormWithData(res.body.data, 'roleForm', true);
    }
  }

  handleRequestException = (res) => {
    console.warn('Error: Could not fetch User data: ', res)
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
        <div>
          <h1>{capitalize(this.state.editContext)} Role</h1>
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
          >
            <Tab label="Role Details" value="role">
              <div className="tab-content">
                <h2 style={styles.headline}>Role Details</h2>
                <ResourceForm 
                  formName='roleForm'
                  resourceURL={this.state.editContext === 'edit' ? `roles/${this.state.resourceId}` : 'roles'}
                  resourceId={this.state.editContext === 'edit' ? this.state.resourceId : undefined}
                  resourceType='role'
                  editContext={this.state.editContext}
                  formLoaded={this.state.editContext === 'edit'}
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
                <PermissionsList resourceId={this.state.editContext === 'edit' ? this.state.resourceId : undefined} 
                  submitPermissions={this.state.submitPermissions}
                  updatePermissionsCallback={this.updateSubmitPermissions}
                  rolePermissions={this.state.rolePermissions}
                  roleId={this.state.roleId}
                />
              </div>
            </Tab>
          </Tabs>
        </div>
      )
    } else {
      return (
        <div>
          <h2 style={styles.headline}>{capitalize(this.state.editContext)} Role</h2>
          <ResourceForm 
            formName='roleForm'
            resourceURL={this.state.editContext === 'edit' ? `roles/${this.state.resourceId}` : 'roles'}
            resourceId={this.state.editContext === 'edit' ? this.state.resourceId : undefined}
            resourceType='role'
            editContext={this.state.editContext}
            formLoaded={this.state.editContext === 'edit'}
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
    loadFormWithData: (fieldValues, formName, isValid) => {
      dispatch({
        type: 'FORM_LOAD',
        fieldValues,
        formName,
        valid: isValid
      })
    },
    dispatch
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Edit);