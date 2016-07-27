import React from 'react';
import TextField from 'material-ui/TextField';

const StripeFields = [
  (<TextField id="cc-num" name="cc-num" hintText="Credit Card Number" floatingLabelText='Credit Card Number' data-stripe='number' />),
  (<TextField id="cc-exp-month" name="cc-exp-month" hintText="##" floatingLabelText='Expiration Month' data-stripe='exp-month' />),
  (<TextField id="cc-exp-year" name="cc-exp-year" hintText="####" floatingLabelText='Expiration Year' data-stripe='exp-year' />),
  (<TextField id="cc-cvc" name="cc-cvc" hintText="###" floatingLabelText='CVC' data-stripe='cvc' />)
]


export default StripeFields