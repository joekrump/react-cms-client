import React from 'react'
import ResourceForm from '../../../../Forms/ResourceForm';
import { connect } from 'react-redux'
import AdminLayout from '../../Layout/AdminLayout'
import {Tabs, Tab} from 'material-ui/Tabs';
import RolesList from './RolesList';
import { capitalize } from '../../../../../helpers/StringHelper';

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
    
    let editContext = props.params && props.params.resourceId ? 'edit' : 'new';
    let resourceId = editContext === 'edit' ? parseInt(props.params.resourceId, 10) : undefined;
    this.state = {
      currentTab: 'user',
      updateRole: false,
      editContext,
      resourceId
    };

    props.updateAdminState('users', editContext, resourceId);
  }

  handleTabChange = (value) => {
    this.setState({
      currentTab: value,
    });
  };

  updateRoleShouldUpdate(value) {
    this.setState({updateRole: value})
  }

  renderInterface() {
    if(this.props.currentUser.isAdmin) {
      return (
        <div>
          <h1>{capitalize(this.state.editContext)} User</h1>
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
          >
            <Tab label="User Details" value="user" >
              <div className="tab-content">
                <h2 style={styles.headline}>User Details</h2>
                <ResourceForm 
                  formName='userForm'
                  resourceURL={this.state.editContext === 'edit' ? `users/${this.state.resourceId}` : 'users'}
                  resourceId={this.state.resourceId}
                  resourceType='user'
                  editContext={this.state.editContext}
                  successCallback={() => {
                    this.updateRoleShouldUpdate(true); 
                  }}
                />
              </div>
            </Tab>
            <Tab label="Roles" value="roles">
              <div className="tab-content">
                <h2 style={styles.headline}>Roles</h2>
                <p className="instructions">
                  Select a Role for this user by choosing one below. Note that each Role grant a User specific
                  Permissions.
                </p>
                <RolesList resourceId={this.state.resourceId} 
                  assignRoleCallback={(value) => this.updateRoleShouldUpdate(value)} updateRole={this.state.updateRole}
                />
              </div>
            </Tab>
          </Tabs>
        </div>
      )
    } else {
      return (
        <div>
          <h2 style={styles.headline}>{capitalize(this.state.editContext)} User</h2>
          <ResourceForm 
            formName='userForm'
            resourceURL={this.state.editContext === 'edit' ? `users/${this.props.params.resourceId}` : 'users'}
            resourceId={this.state.editContext === 'edit' ? this.props.params.resourceId : undefined}
            resourceType='user'
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

const mapStateToProps = (state) => ({currentUser: state.auth.user})

const mapDispatchToProps = (dispatch) => ({
  updateAdminState: (namePlural, pageType, resourceId) => {
    dispatch({
      type: 'UPDATE_ADMIN_STATE',
      namePlural,
      pageType,
      resourceId
    })
  },
  dispatch
})

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(Edit);