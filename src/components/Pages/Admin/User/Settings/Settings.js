import React from 'react'
import ResourceForm from '../../../../Forms/ResourceForm';
import { connect } from 'react-redux'
import AdminLayout from '../../Layout/AdminLayout'
const Settings = () => ({
  
  render() {
    if(!this.props.user) {
      return null;
    } else {
      return (
        <AdminLayout>
          <div className="user-settings">
            <h1>User Settings</h1>
            <ResourceForm 
              formName='userForm'
              resourceURL={'users/' + this.props.user.id}
              resourceId={this.props.user.id}
              resourceType='user'
              editContext='edit'
            />
          </div>
        </AdminLayout>
      );
    }   
  }
});

const mapStateToProps = (state) => {
  return {
    user: state.auth.user
  }
}

export default connect(
  mapStateToProps
)(Settings);