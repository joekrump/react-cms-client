import React from 'react';
import { PaymentForm } from './PaymentForm';
import StripConfig from '../../../../../app_config/stripe';
import { redA700 } from 'material-ui/styles/colors';
import CircularProgress from 'material-ui/CircularProgress';
import { connect } from 'react-redux';
import PaymentThankYou from './ThankYou';
import { loadScript } from '../../../../helpers/ScriptsHelper'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './PaymentContent.scss';

// var ReactScriptLoaderMixin = require('react-script-loader').ReactScriptLoaderMixin;
const stripeScriptURL = 'https://js.stripe.com/v2/';

class PaymentContent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      stripeLoading: true,
      stripeLoadingError: false
    }
    loadScript(stripeScriptURL, () => {
      if (!PaymentForm.getStripeToken) {
        // Put your publishable key here
        // eslint-disable-next-line
        Stripe.setPublishableKey(StripConfig.test.pk);
        this.setState({ stripeLoading: false, stripeLoadingError: false });
      }
    },
    () => this.setState({ stripeLoading: false, stripeLoadingError: true }));
  }
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
    else if (this.props.paymentComplete) {
      content = (
        <PaymentThankYou />
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
}

const maptStateToProps = (state) => {
  return {
    paymentComplete: state.forms.paymentForm.completed,
  }
}

const PaymentContentRedux = connect(
  maptStateToProps
)(PaymentContent)

export default withStyles(s)(PaymentContentRedux);