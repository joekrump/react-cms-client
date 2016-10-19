import React from 'react';
import PaymentFormContainer from '../../../Forms/PaymentForm/PaymentFormContainer';

const PaymentPageTemplate = (props) => (
  <div className="page payment">
    <div className="page-container">
      <div data-editable data-name="name" onInput={props.handleNameChanged ? props.handleNameChanged : undefined}>
        <h1 data-ce-placeholder="Page Title">{props.name ? props.name : ''}</h1>
      </div>
      <div data-editable data-name="content" data-ce-placeholder="Content..."  dangerouslySetInnerHTML={{__html: props.content}} />
      <PaymentFormContainer submitDisabled={props.submitDisabled} editMode={props.editMode} />
    </div>
  </div>
)

export default PaymentPageTemplate;
