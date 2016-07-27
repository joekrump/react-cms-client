import React from 'react';
import TextField from 'material-ui/TextField';

const StripeFields = () => {
  return [
    (<TextField id="cc-num" type="text" hintText="Credit Card Number" floatingLabelText='Credit Card Number' data-stripe='number' />),
    (<TextField id="cc-exp-mon" type="text" hintText="##" floatingLabelText='Expiration Month' data-stripe='exp-month' />),
    (<TextField id="cc-exp-year" type="text" hintText="####" floatingLabelText='Expiration Year' data-stripe='exp-year' />),
    (<TextField id="cc-exmp-cvc" type="text" hintText="###" floatingLabelText='CVC' data-stripe='cvc' />)
  ]
};

export default StripeFields