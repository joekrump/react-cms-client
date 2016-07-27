import React from 'react';
import request from 'superagent';
import AppConfig from '../../config/app';

// Icons
import CreditCardIcon from 'material-ui/svg-icons/action/credit-card';
import VerifiedUserIcon from 'material-ui/svg-icons/action/verified-user';
import SendIcon from 'material-ui/svg-icons/content/send';
// mui components
import TextField from 'material-ui/TextField';

import {List, ListItem} from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

import {greenA700} from 'material-ui/styles/colors';

import StripeFields from './StripeFields';

// Redux Form Util pieces
// 
import { createForm } from 'redux-form-utils';


var listItemStyle = {
  padding: "0 16px"
};

createForm(
  {
    form: 'paymentForm',
    fields: ['amt', 'email', 'fname', 'lname']
  }
)

// NONE STRIPE INPUT props
// id="fname"
// name="fname"
// type="text"
// hintText="First Name"
// floatingLabelText="First Name"
// errorText={this.state.formErrors.fname}
// onChange={(e) => this.handleInputChange(e, 'fname')} 
// defaultValue={this.state.formFields.fname}

class PaymentForm extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      submitDisabled: false,
      paymentComplete: false,
      formFields: {
        amt: null,
        email: null,
        fname: null,
        lname: null
      },
      formErrors: {
        email: null,
        amt: null
      }
    };
  }
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
    this.setState({
      formFields: {
        email: null,
        fname: null,
        lname: null,
        amt: null
      },
      paymentComplete: false
    })
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

    var stripeFieldListItems = StripeFields.map(() => {
      return ();
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
          <ListItem disabled={true} disableKeyboardFocus={true} style={listItemStyle}>
            
          </ListItem>
          <ListItem disabled={true} disableKeyboardFocus={true} style={listItemStyle}>
            
          </ListItem>
          <ListItem disabled={true} disableKeyboardFocus={true} style={listItemStyle}>
            
          </ListItem>
          <ListItem disabled={true} disableKeyboardFocus={true} style={listItemStyle}>
            
          </ListItem>
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