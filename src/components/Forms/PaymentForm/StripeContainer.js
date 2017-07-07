import React from "react";
import {StripeProvider} from 'react-stripe-elements';
import StripeConfig from '../../../../app_config/stripe';
import {Elements} from 'react-stripe-elements';

const StripeContainer = (props) => (
  <StripeProvider apiKey={StripeConfig.pk}>
    <Elements>
      {props.children}
    </Elements>
  </StripeProvider>
);

export default StripeContainer;
