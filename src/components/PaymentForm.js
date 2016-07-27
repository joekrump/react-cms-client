import React from 'react';
import request from 'superagent';
import AppConfig from '../../config/app';

// Icons
import CreditCardIcon from 'material-ui/svg-icons/action/credit-card';
import VerifiedUserIcon from 'material-ui/svg-icons/action/verified-user';
import SendIcon from 'material-ui/svg-icons/content/send';

import {List, ListItem} from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

import {greenA700} from 'material-ui/styles/colors';

import StripeFields from './StripeFields';

var listItemStyle = {
  padding: "0 16px"
};


class PaymentForm extends React.Component {

  emitPaymentError(errorMessage){
    // TODO: Fire event with error message 'Payment Error Event'
    // with following data:
    // { snackbarMessage: errorMessage, submitDisabled: false, snackbarOpen: true, snackbarColor: redA700, snackbarHeaderText: 'Error' }
  }
  handleOnSubmit(event) {
    event.preventDefault();
    // Submit CC fields to Stripe for processing.
    // eslint-disable-next-line
    this.props.stripe.createToken(event.target, function(status, response) {
      if (response.error) {
        this.emitPaymentError(response.error.message)
      }
      else {
        this.submitToServer(response.id, this);
      }
    }.bind(this));

  }
  resetForm(){
  }
  
  handleInputChange(e, fieldName){
    var formFieldsToUpdate = this.state.formFields;
    // TODO: run some validation on the frontend to check for valid email and valid amt.
    formFieldsToUpdate[fieldName] = e.target.value;
    this.setState({formFields: formFieldsToUpdate});
  }
  submitToServer(token, self){
    request.post(AppConfig.apiBaseUrl + 'stripe/make-payment')
      .set('Access-Control-Allow-Origin', AppConfig.baseUrl)
      .set('Accept', 'application/json')
      .send({
        token: token, 
        ...self.state.formFields
      })
      .end(function(err, res){

        if(err !== null) {
          // Something unexpected happened
          self.emitPaymentError(res);
        } else if (res.statusCode !== 200) {
          self.emitPaymentError(res);
        } else {
          self.setState({paymentComplete: true, submitDisabled: false});
          // TODO: Fire an event with the following data: 
          // {snackbarOpen: true, snackbarColor: greenA700, snackbarHeaderText: 'Success', snackbarMessage: 'Payment Processed'}
          // will be listened for and handled by PaymentPage
          // 
          // 
          setTimeout(function(){
            self.resetForm();
          }, 3000);
        }
      });
  }
  render() {
    const { clear, clearAll } = this.props;
    const { email, amt, fname, lname } = this.props.fields;

    var stripeFieldListItems = StripeFields.map((StripeField, i) => {
      return (
        <ListItem key={'stripe-field-' + i} disabled={true} disableKeyboardFocus={true} style={listItemStyle}>
          {StripeField}
        </ListItem>
      );
    })
    return (
      <form onSubmit={this.handleOnSubmit} className="payment-content">
        <List>
          <ListItem className="payment-header" primaryText={<h2 className="li-primary-text">Your Details</h2>} leftIcon={<VerifiedUserIcon />} disabled={true} disableKeyboardFocus={true} />
          <ListItem disabled={true} disableKeyboardFocus={true} style={listItemStyle}>
            <TextField type="text" hintText="First Name" floatingLabelText="First Name" {...fname} />
          </ListItem>
          <ListItem disabled={true} disableKeyboardFocus={true} style={listItemStyle}>
            <TextField type="text" hintText="Last Name" floatingLabelText="Last Name" {...lname} />
          </ListItem>
          <ListItem disabled={true} disableKeyboardFocus={true} style={listItemStyle}>
            <TextField type="text" hintText="Email" floatingLabelText="Email" {...email} />
          </ListItem>
        </List>
        <List>
          <ListItem className="payment-header" primaryText={<h2 className="li-primary-text">Payment Details</h2>} leftIcon={<CreditCardIcon />} disabled={true} disableKeyboardFocus={true} />
          <ListItem disabled={true} disableKeyboardFocus={true} style={listItemStyle}>
            <TextField type="text" hintText="Ex. 5.00" floatingLabelText='Amount in dollars (CAD)' {...amt} />
          </ListItem>
          {stripeFieldListItems}
          <ListItem disabled={true} disableKeyboardFocus={true}>
            <div>
              <RaisedButton
                label="Submit Payment"
                primary
                disabled={this.state.submitDisabled}
                icon={<SendIcon />}
                type="submit"
                style={{float:'left'}}
              />
              {this.state.submitDisabled ? <CircularProgress size={0.5} style={{float:'left'}}/> : null}                
            </div>
          </ListItem>
        </List>
      </form>
    )
  }
};


export default PaymentForm;