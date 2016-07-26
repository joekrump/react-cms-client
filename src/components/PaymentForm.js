import React from 'react';
import request from 'superagent';
import StripConfig from '../../config/stripe'

var ReactScriptLoaderMixin = require('react-script-loader').ReactScriptLoaderMixin;

const PaymentForm = React.createClass({
  mixins: [ ReactScriptLoaderMixin ],

  getInitialState: function() {
    return {
      stripeLoading: true,
      stripeLoadingError: false,
      submitDisabled: false,
      paymentError: null,
      paymentComplete: false,
      token: null,
      amt: 2.00,
      email: null
    };
  },

  getScriptURL: function() {
    return 'https://js.stripe.com/v2/';
  },

  onScriptLoaded: function() {
    if (!PaymentForm.getStripeToken) {
      // Put your publishable key here
      Stripe.setPublishableKey(StripConfig.test.pk);

      this.setState({ stripeLoading: false, stripeLoadingError: false });
    }
  },

  onScriptError: function() {
    this.setState({ stripeLoading: false, stripeLoadingError: true });
  },

  handleOnSubmit: function(event) {
    var self = this;
    event.preventDefault();
    this.setState({ submitDisabled: true, paymentError: null });
    // send form here
    Stripe.createToken(event.target, function(status, response) {
      if (response.error) {
        self.setState({ paymentError: response.error.message, submitDisabled: false });
      }
      else {
        // make request to your server here!
        self.sendToken(response.id, self);
      }
    });
  },
  handleInputChange(e, fieldName){
    var newStateKeyValue = {};
    var inputValue = e.target.value;
    // TODO: run some validation on the frontend to check for valid email and valid amt.
    newStateKeyValue[fieldName] = inputValue;
    this.setState(newStateKeyValue)
  },
  sendToken(token, self){
    var email = 
    request.post('http://laravel-api:1337/api/stripe/make-payment')
      .set('Access-Control-Allow-Origin', 'http://localhost:3000')
      .set('Accept', 'application/json')
      .send({
        email: this.state.email,
        token: token, 
        amt: this.state.amt
      })
      .end(function(err, res){

        if(err !== null) {
          // Something unexpected happened
          console.warn('Serious Error', err);
          self.setState({ paymentError: res, submitDisabled: false });
        } else if (res.statusCode !== 200) {
          console.log('Problem: ', res);
          self.setState({ paymentError: res, submitDisabled: false });
        } else {
          console.log('Success: ', res);
          self.setState({ paymentComplete: true, submitDisabled: false });
          // TODO: tell the user that the payment has been processed successfully.
          setTimeout(function(){
            self.setState({paymentComplete: false})
          }.bind(self), 2000);
        }
      });
  },
  render: function() {
    if (this.state.stripeLoading) {
      return <div>Loading</div>;
    }
    else if (this.state.stripeLoadingError) {
      return <div>Error</div>;
    }
    else if (this.state.paymentComplete) {
      return <div>Payment Complete!</div>;
    }
    else {
      return (<form onSubmit={this.handleOnSubmit} >
        <span>{ this.state.paymentError }</span><br />
        <input id="email" type='email' name="email" placeholder='email' onChange={(e) => this.handleInputChange(e, 'email')} defaultValue={this.state.email} /><br />
        <input id="amt" type="text" placeholder='amount in dollars (CAD)' onChange={(e) => this.handleInputChange(e, 'amt')} defaultValue={this.state.amt} /><br />
        <input type='text' data-stripe='number' placeholder='credit card number' /><br />
        <input type='text' data-stripe='exp-month' placeholder='expiration month' /><br />
        <input type='text' data-stripe='exp-year' placeholder='expiration year' /><br />
        <input type='text' data-stripe='cvc' placeholder='cvc' /><br />
        <input disabled={this.state.submitDisabled} type='submit' value='Purchase' />
      </form>);
    }
  }
});


export default PaymentForm;