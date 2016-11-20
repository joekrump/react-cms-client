import React from 'react';
import ResetPasswordForm  from '../../../Forms/ResetPassword';

const ResetPasswordTemplate = (props) => (
  <div className="page login">
    <div className="page-container">
      <div data-editable data-name="name" onInput={props.handleNameChanged ? props.handleNameChanged : undefined}>
        <h1 data-ce-placeholder="Page Title">{props.name ? props.name : ''}</h1>
      </div>
      <div className="page-content" data-editable data-name="content" data-ce-placeholder="Content..."  dangerouslySetInnerHTML={{__html: props.content}} />
      <ResetPasswordForm />
    </div>
  </div>
)

export default ResetPasswordTemplate;