import React from 'react'
import ResourceForm from '../../../../Forms/ResourceForm';
import { connect } from 'react-redux'
import AdminLayout from '../../Layout/AdminLayout'
import {Tabs, Tab} from 'material-ui/Tabs';
import RolesList from './RolesList';

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
    
    let editContext = props.params && props.params.userId ? 'edit' : 'new';
    
    this.state = {
      currentTab: 'user',
      editContext: editContext,
      updateRole: false,
      userId: editContext === 'edit' ? props.params.userId : undefined 
    };
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
        <Tabs
          value={this.state.value}
          onChange={this.handleChange}
        >
          <Tab label="User Details" value="user" >
            <div className="tab-content">
              <h2 style={styles.headline}>User Details</h2>
              <ResourceForm 
                formName='userForm'
                resourceURL={this.state.editContext === 'edit' ? `users/${this.state.userId}` : 'users'}
                resourceId={this.state.userId}
                resourceType='user'
                editContext={this.state.editContext}
                successCallback={() => {
                  updateRoleShouldUpdate(true); 
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
              <RolesList userId={this.state.userId} 
                assignRoleCallback={this.updateRoleShouldUpdate} updateRole={this.state.updateRole}
              />
            </div>
          </Tab>
        </Tabs>
      )
    } else {
      return (
        <div>
          <h2 style={styles.headline}>User Details</h2>
          <ResourceForm 
            formName='userForm'
            resourceURL={this.state.editContext === 'edit' ? `users/${this.props.params.userId}` : 'users'}
            resourceId={this.state.editContext === 'edit' ? this.props.params.userId : undefined}
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

const mapStateToProps = (state) => {
  return {currentUser: state.auth.user}
}

export default connect(
  mapStateToProps
)(Edit);