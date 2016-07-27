import React from 'react';
import request from 'superagent';
import AppConfig from '../../../config/app';

// Icons
import CreditCardIcon from 'material-ui/svg-icons/action/credit-card';
import VerifiedUserIcon from 'material-ui/svg-icons/action/verified-user';

// mui components
import {List, ListItem} from 'material-ui/List';
// import CircularProgress from 'material-ui/CircularProgress';

// import {greenA700} from 'material-ui/styles/colors';

import StripeFields from './StripeFields';

import { Form, TextInput, SubmitButton } from '../Form/index';

// onChange={(e) => this.handleInputChange(e, 'fname')} 
// 
var listItemStyle = {
  padding: "0 16px"
};

const formName = "paymentForm";

class PaymentForm extends React.Component {
  emitPaymentError(errorMessage){
    // TODO: Fire event with error message 'Payment Error Event'
    // with following data:
    // { snackbarMessage: errorMessage, submitDisabled: false, snackbarOpen: true, snackbarColor: redA700, snackbarHeaderText: 'Error' }
  }
  handleOnSubmit(event) {
    event.preventDefault();
    this.setState({ submitDisabled: true, snackbarMessage: null, snackbarOpen: false });
    // Submit CC fields to Stripe for processing.
    // eslint-disable-next-line
    this.props.stripe.createToken(event.target, function(status, response) {
      if (response.error) {

        this.emitPaymentError(response.error.message)
      }
      else {
        // If Stripe processing was successful and has returned a token (response.id) the submit
        // Charge to the server for processing.
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
    let StripeFieldListItems = StripeFields.map((StripeField, i) => {
      return (
        <ListItem key={'stripe-field-' + i} disabled={true} disableKeyboardFocus={true} style={listItemStyle}>
          {StripeField}
        </ListItem>
      );
    })
    return (
      <Form onSubmit={this.handleOnSubmit} className="payment-content">
        <List>
          <ListItem className="payment-header" primaryText={<h2 className="li-primary-text">Your Details</h2>} leftIcon={<VerifiedUserIcon />} disabled={true} disableKeyboardFocus={true} />
          <ListItem disabled={true} disableKeyboardFocus={true} style={listItemStyle}>
            <TextInput placeholder="First Name" label="First Name" formName={formName} />
          </ListItem>
          <ListItem disabled={true} disableKeyboardFocus={true} style={listItemStyle}>
            <TextInput placeholder="Last Name" label="Last Name" formName={formName} />
          </ListItem>
          <ListItem disabled={true} disableKeyboardFocus={true} style={listItemStyle}>
            <TextInput placeholder="Email" label="Email" formName={formName} />
          </ListItem>
        </List>
        <List>
          <ListItem className="payment-header" primaryText={<h2 className="li-primary-text">Payment Details</h2>} leftIcon={<CreditCardIcon />} disabled={true} disableKeyboardFocus={true} />
          <ListItem disabled={true} disableKeyboardFocus={true} style={listItemStyle}>
            <TextInput placeholder="Ex. 5.00" label='Amount in dollars (CAD)' formName={formName} />
          </ListItem>
          {/* STRIPE FIELDS TO GO HERE */}
          { StripeFieldListItems }
          <ListItem disabled={true} disableKeyboardFocus={true}>
            <SubmitButton isFormValid={true} withIcon={true} lable="Submit Payment"/>
          </ListItem>
        </List>
      </Form>
    )
  }
}


export default PaymentForm;