import React from 'react'
import ResourceForm from '../../../Forms/ResourceForm';
import { connect } from 'react-redux';

const SignUp = () => ({
  loginNewUser($user, $token){
  	this.props.loginUser($user, $token, '/admin');
  },
  render() {
    return (

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