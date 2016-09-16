import React from 'react';
import APIClient from '../../../../http/requests'
import { connect } from 'react-redux';

// Icons
import CreditCardIcon from 'material-ui/svg-icons/action/credit-card';
import VerifiedUserIcon from 'material-ui/svg-icons/action/verified-user';

// mui components
import {List, ListItem} from 'material-ui/List';
import { redA700, greenA700 } from 'material-ui/styles/colors';
import CircularProgress from 'material-ui/CircularProgress';
import StripeFields from './StripeFields';
import { Form, TextInput, SubmitButton } from '../../../Form/index';
import StripeConfig from '../../../../../app_config/stripe';
import { loadScript } from '../../../../helpers/ScriptsHelper'

const listItemStyle = {
  padding: "0 16px"
};
const stripeScriptURL = 'https://js.stripe.com/v2/';
const formName = "paymentForm";

class PaymentForm extends React.Component {

  constructor (props){
    super(props)
    this.resetForm = this.resetForm.bind(this)
    this.getStripeToken = this.getStripeToken.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.submitToServer = this.submitToServer.bind(this)

    if(typeof Stripe === 'undefined') {
      this.state = {
        submitDisabled: false,
        stripeLoading: true,
        stripeLoadingError: false
      }

      loadScript(stripeScriptURL, () => {
        if (!this.getStripeToken()) {
          // Put your publishable key here
          // eslint-disable-next-line
          Stripe.setPublishableKey(StripeConfig.test.pk);
          this.setState({ stripeLoading: false, stripeLoadingError: false });
        }
      },
      () => this.setState({ stripeLoading: false, stripeLoadingError: true }));
    } else {
      this.state = {
        submitDisabled: false,
        stripeLoading: false,
        stripeLoadingError: false
      }
    }
  }
  componentDidMount() {
    let client = new APIClient(this.context.store);
    this.setState({client});
  }
  resetForm(){
    this.props.resetForm()
  }
  getStripeToken() {
    return this.props.stripeToken
  }
  handleFormSubmit(e) {
    e.preventDefault();
    // Submit CC fields to Stripe for processing.
    // eslint-disable-next-line
    Stripe.createToken(e.target, function(status, response) {
      if (response.error) {
        this.props.updatePaymentError(response.error.message)
        this.props.updatePaymentNotification(true, redA700, 'Error', response.error.message);
      }
      else {
        this.props.updateStripeToken(response.id);
        // If Stripe processing was successful and has returned a token (response.id) the submit
        // Charge to the server for processing.
        this.submitToServer(response.id, this);
      }
    }.bind(this));
  }
  submitToServer(stripeToken, self){
    this.state.client.post('stripe/make-payment', false, {
      data: {
        token: stripeToken, 
        ...self.state.formFields
      }})
      .then((res) => {
        if (res.statusCode !== 200) {
          self.props.updatePaymentError(res);
          self.props.updatePaymentNotification(true, redA700, 'Error', res);
        } else {
          self.props.updatePaymentError(null);
          self.props.updatePaymentNotification(true, greenA700, 'Success', 'Payment Processed');
          self.props.updateFormCompleteStatus(true);
          setTimeout(self.resetForm, 3000);
        }
      })
      .catch((err) => {
        // Something unexpected happened
        self.props.updatePaymentError(err);
        self.props.updatePaymentNotification(true, redA700, 'Error', err);
      })
  }
  render() {
    let StripeFieldListItems = StripeFields.map((StripeField, i) => {
      return (
        <ListItem key={'stripe-field-' + i} disabled={true} disableKeyboardFocus={true} style={listItemStyle}>
          {StripeField}
        </ListItem>
      );
    })

    if (this.state.stripeLoading) {
      return (
        <div className="payment-content">
          <h3 className="payment-header">Loading Payment System...</h3>
          <div>
            <CircularProgress size={1.0} />
          </div>
        </div>
      );
    } else {
      return (
        <Form onSubmit={this.handleFormSubmit} className="payment-content">
          <List>
            <ListItem className="payment-header" primaryText={<h2 className="li-primary-text">Your Details</h2>} leftIcon={<VerifiedUserIcon color={'#fff'}/>} disabled={true} disableKeyboardFocus={true} />
            <ListItem disabled={true} disableKeyboardFocus={true} style={listItemStyle}>
              <TextInput placeholder="First Name" label="First Name" formName={formName} name="fname"/>
            </ListItem>
            <ListItem disabled={true} disableKeyboardFocus={true} style={listItemStyle}>
              <TextInput placeholder="Last Name" label="Last Name" formName={formName} name="lname"/>
            </ListItem>
            <ListItem disabled={true} disableKeyboardFocus={true} style={listItemStyle}>
              <TextInput placeholder="Email" label="Email" formName={formName} name="email"/>
            </ListItem>
          </List>
          <List>
            <ListItem className="payment-header" primaryText={<h2 className="li-primary-text">Payment Details</h2>} leftIcon={<CreditCardIcon color={'#fff'}/>} disabled={true} disableKeyboardFocus={true} />
            <ListItem disabled={true} disableKeyboardFocus={true} style={listItemStyle}>
              <TextInput placeholder="Ex. 5.00" label='Amount in dollars (CAD)' formName={formName} name="amt"/>
            </ListItem>
            {/* STRIPE FIELDS TO GO HERE */}
            { StripeFieldListItems }
            <ListItem disabled={true} disableKeyboardFocus={true}>
              <SubmitButton isFormValid={!this.state.submitDisabled} withIcon={true} label="Submit Payment"/>
            </ListItem>
          </List>
        </Form>
      )
    }
  }
}

PaymentForm.contextTypes = {
  store: React.PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    isFormValid: !state.forms.paymentForm.error,
    stripeToken: state.payments.stripeToken
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateStripeToken: (stripeToken) => {
      dispatch ({
        type: 'UPDATE_STRIPE_TOKEN',
        stripeToken
      })
    },
    updatePaymentError: (error) => {
      dispatch ({
        type: 'FORM_ERROR',
        error,
        formName: formName
      })
    },
    updateFormCompleteStatus: (complete) => {
      dispatch ({
        type: 'FORM_COMPLETE',
        complete,
        formName: formName
      })
    },
    updatePaymentNotification: (
      snackbarOpen,
      snackbarColor,
      snackbarHeaderText,
      snackbarMessage ) => {
      
      dispatch ({
        type: 'UPDATE_PAYMENT_NOTIFICATION',
        snackbarOpen,
        snackbarColor,
        snackbarHeaderText,
        snackbarMessage
      })
    },
    resetForm: () => {
      dispatch ({
        type: 'FORM_RESET',
        formName: formName
      })
    }
  };
}

const PaymentFormRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(PaymentForm)

export {PaymentFormRedux as PaymentForm}