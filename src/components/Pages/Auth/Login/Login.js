import React from 'react';
import FrontendLayout from '../../../Layout/FrontendLayout'
import LoginForm from '../../../Forms/LoginForm'

const Login = (props) => (
  <FrontendLayout>
    <LoginForm location={props.location}/>
  </FrontendLayout>
)

export default Login;