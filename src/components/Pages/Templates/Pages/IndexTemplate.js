// components/Pages/Templates/Pages/IndexTemplate.js

import React from 'react';
import SignupForm  from '../../../Forms/SignupForm';

class IndexTemplate extends React.Component {
  <div className="page login">
    <div className="page-container">
      <div data-editable data-name="name" onInput={props.handleNameChanged ? props.handleNameChanged : undefined}>
        <h1 data-ce-placeholder="Page Title">{props.name ? props.name : ''}</h1>
      </div>
      <div data-editable data-name="content" data-ce-placeholder="Content..."  dangerouslySetInnerHTML={{__html: props.content}} />
      <SignupForm />
    </div>
  </div>
}

export default IndexTemplate;