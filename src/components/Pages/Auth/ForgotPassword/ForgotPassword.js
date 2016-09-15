import React from 'react'
import FrontendLayout from '../../../Layout/FrontendLayout'
// import { connect } from 'react-redux'

const ForgotPassword = () => ({
  
  render() {
    return (
      <FrontendLayout>
        <div className="password-reset">
          <h1>Reset Password</h1>
        </div>
      </FrontendLayout>
    );
  }
});

// const mapStateToProps = (state) => {
//   return {
//     user: state.auth.user
//   }
// }
// 

export default ForgotPassword;