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
    this.state = {
      currentTab: 'user',
      editContext: props.params && props.params.userId ? 'edit' : 'new'
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
          <Tab label="User Details" value="user" >
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
          </Tab>
          <Tab label="Roles" value="roles">
            <div>
              <h2 style={styles.headline}>Roles</h2>
              <p>
                This is another example of a controllable tab. Remember, if you
                use controllable Tabs, you need to give all of your tabs values or else
                you wont be able to select them.
              </p>
              <RolesList />
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
            resourceURL={'users/' + this.props.user.id}
            resourceId={this.props.user.id}
            resourceType='user'
            editContext='edit'
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