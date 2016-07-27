import React from 'react';
import { TextInput } from '../Form/index';

const StripeFields = () => {
  return [
    (<TextInput id="cc-num" name="cc-num" placehoolder="Credit Card Number" label='Credit Card Number' data-stripe='number' />),
    (<TextInput id="cc-exp-month" name="cc-exp-month" placehoolder="##" label='Expiration Month' data-stripe='exp-month' />),
    (<TextInput id="cc-exp-year" name="cc-exp-year" placehoolder="####" label='Expiration Year' data-stripe='exp-year' />),
    (<TextInput id="cc-cvc" name="cc-cvc" placehoolder="###" label='CVC' data-stripe='cvc' />)
  ]
};

export default StripeFields