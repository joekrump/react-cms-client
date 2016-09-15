import React from 'react'
import ResourceForm from '../../../Forms/ResourceForm';
import { connect } from 'react-redux';
import FrontendLayout from '../../../Layout/FrontendLayout'

const SignUp = () => ({
  loginNewUser($user, $token){
  	this.props.loginUser($user, $token, '/admin');
  },
  render() {
    return (
      <FrontendLayout>
        <div className="user-signup">
          <h1>Sign Up</h1>

          <ResourceForm 
            formName={'signupForm'} 
            submitUrl={'auth/signup'}
            resourceType='user'
            context='new'
            loginCallback={this.loginNewUser.bind(this)}
          />
        </div>
      </FrontendLayout>
    );
  }
});

const mapDispatchToProps = (dispatch) => {
  return {
    loginUser: (user, token, redirectPath) => {
      dispatch ({
        type: 'USER_LOGGED_IN',
        user,
        token,
        redirectPath
      })
    }
  }
}
export default connect(
  null,
  mapDispatchToProps
)(SignUp)