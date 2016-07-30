import React from 'react';
import { PaymentForm } from './PaymentForm';
import StripConfig from '../../../config/stripe';
import { redA700 } from 'material-ui/styles/colors';
import CircularProgress from 'material-ui/CircularProgress';

import './PaymentContent.css';

var ReactScriptLoaderMixin = require('react-script-loader').ReactScriptLoaderMixin;

const PaymentContent = React.createClass({
  mixins: [ ReactScriptLoaderMixin ],

  getInitialState(){
    return {
      stripeLoading: true,
      stripeLoadingError: false
    }
  },
  getScriptURL: function() {
    return 'https://js.stripe.com/v2/';
  },

  onScriptLoaded: function() {
    if (!PaymentForm.getStripeToken) {
      // Put your publishable key here
      // eslint-disable-next-line
      Stripe.setPublishableKey(StripConfig.test.pk);
      this.setState({ stripeLoading: false, stripeLoadingError: false });
    }
  },

  onScriptError: function() {
    this.setState({ stripeLoading: false, stripeLoadingError: true });
  },
  render(){
    var content = null;

    if (this.state.stripeLoading) {
      content = (
        <div className="payment-content">
          <h3 className="payment-header">Loading Payment System...</h3>
          <div>
            <CircularProgress size={1.0} />
          </div>
        </div>
      );
    }
    else if (this.state.stripeLoadingError) {
      content = (
        <div className="payment-content">
          <h3 style={{color: redA700}} className="payment-header">Error While Loading Payment System</h3>
          <p>
            Please try refreshing the page.
          </p>
        </div>
      );
    }
    else if (this.state.paymentComplete) {
      content = (
        <div className="payment-content">
          <h3 className="payment-header">Thank You</h3>
          <p>
            You can expect to receive an receipt by email for this payment once the payment has been fully processed.
          </p>
        </div>
      );
    }
    else {
      content = (
        // eslint-disable-next-line
        <PaymentForm stripe={Stripe}/>
      )
    }

    return(
      content
    );
  }
});

export default PaymentContent;