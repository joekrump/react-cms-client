import React from 'react'
import ResourceForm from '../Forms/ResourceForm';
import { connect } from 'react-redux'
const UserSettings = () => ({
  
  render() {
    return (

      <div className="user-settings">
        <h1>User Settings</h1>

        <ResourceForm 
          formName={'userForm'} 
          submitUrl={'users/' + this.props.user.id}
          resourceId={this.props.user.id}
          resourceType='user'
          resourceNamePlural='users'
          context='edit'
        />
      </div>
    );
  }

});

const mapStateToProps = (state) => {
  return {
    user: state.auth.user
  }
}

export default connect(
  mapStateToProps
)(UserSettings);