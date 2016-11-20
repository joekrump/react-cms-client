import React from 'react';
import LoginForm  from '../../../Forms/LoginForm';

const LoginPageTemplate = (props) => (
  <div className="page login">
    <div className="page-container">
      <div data-editable data-name="name" onInput={props.handleNameChanged ? props.handleNameChanged : undefined}>
        <h1 className="page-title" data-ce-placeholder="Page Title">{props.name ? props.name : ''}</h1>
      </div>
      <LoginForm location={props.disabled ? undefined : props.location} disabled={props.disabled} />
      <div className="page-content" data-editable data-name="content" data-ce-placeholder="Content..."  dangerouslySetInnerHTML={{__html: props.content}} />
    </div>
  </div>
)

export default LoginPageTemplate;